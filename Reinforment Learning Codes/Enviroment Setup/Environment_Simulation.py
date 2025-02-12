import gym
import pickle
import math
from gym import spaces
from random import choice
import numpy as np
from Data_Processing.Constraints import installment_fee, BUDGET, INSTALL_FEE
from Data_Processing.Benefit_Function import charging_capacity, influential_radius, CHARGING_POWER, update_node_benefit
from Data_Processing.Cost_Function import single_charging_time, single_waiting_time, seeking_station, single_travel_time
from Data_Processing.Overall_Settings import existing_score, normalize_score, K
from charging_configuration import prepare_config, initial_solution, choose_by_benefit, choose_by_demand, relocate_by_benefit, support_stations



class Station:
    def __init__(self):
        self.s_pos = None
        self.s_x = None
        self.s_dict = {}
        self.station = [self.s_pos, self.s_x, self.s_dict]

    def __repr__(self):
        return "This station is {}".format(self.station)

    def add_position(self, node):
        self.station[0] = node

    def add_chargers(self, my_config):
        self.station[1] = my_config

    def establish_dictionary(self, node_list):   
        # update stations attributes
        self.station = installment_fee(self.station)
        self.station = charging_capacity(self.station)
        self.station = influential_radius(self.station)
        self.station = single_charging_time(self.station, node_list)
        self.station = single_waiting_time(self.station, node_list)

class Plan:
    def __init__(self, node_list, node_dict, cost_dict, my_plan_file):
        with (open(my_plan_file, "rb")) as f:  # existing plan file (evcs data)
            self.plan = pickle.load(f)
        # Update the corresponding attributes of each station and node
        self.plan = [charging_capacity(station) for station in self.plan]
        self.plan = [influential_radius(station) for station in self.plan]
        node_list = seeking_station(self.plan, node_list, node_dict, cost_dict)
        node_list = single_travel_time(node_list)
        self.plan = [single_charging_time(station, node_list) for station in self.plan]
        self.plan = [single_waiting_time(station, node_list) for station in self.plan]
        self.plan = [installment_fee(station) for station in self.plan]
        self.basic_cost = sum([station[2]["installation_fee"] for station in self.plan]) 
        self.norm_score, self.norm_benefit, self.norm_cost, self.norm_travel, self.norm_charg, self.norm_wait  = \
            existing_score(self.plan, node_list)
        self.existing_plan = self.plan.copy()
        self.existing_plan = [s[0] for s in self.existing_plan] # Preserve node indices for unchanged stations

    def __repr__(self):  
        return "The charging plan is {}".format(self.plan)

    def add_plan(self, station):
        """
        Add a station to the plan
        """
        self.plan.append(station)

    def remove_plan(self, station): 
        """
        Remove a station from the plan
        """
        self.plan.remove(station)

    def relocate_charger(self, stolen_station, my_budget): 
        """
        Steal a charger from the station, refund the installation fee to budget, and identify the type of charger stolen
        """
        # relocate a charger need installation fee
        my_budget += stolen_station[2]["installation_fee"]
        station_index = self.plan.index(stolen_station)
        # Remove the most expensive charger first
        if stolen_station[1][2] > 0:  
            self.plan[station_index][1][2] -= 1  
            config_index = 2  # mark
        elif stolen_station[1][1] > 0:     
            self.plan[station_index][1][1] -= 1
            config_index = 1
        else:
            self.plan[station_index][1][0] -= 1  
            config_index = 0
        if sum(stolen_station[1]) == 0: # If all chargers are stolen
            # this means we remove the entire stations as it only has one charger
            self.remove_plan(stolen_station)
        else:  
            # the station remains, we only steal one charging column
            installment_fee(stolen_station) # Recalculate fees for the station with fewer chargers
            my_budget -= stolen_station[2]["installation_fee"]  
        return my_budget, config_index

class Station_Deployment(gym.Env):
    """
    Custom Environment that follows the gym interface
    """
    node_dict = {}
    cost_dict = {}

    def __init__(self, node_file, my_plan_file, env_num):
        super(Station_Deployment, self).__init__()
        with open(node_file, "r") as file:
            content = file.readline()
            self.node_list = eval(content, {"nan": math.nan})
        self.plan_file = my_plan_file
        self.node_list = [self.init_node_data(node) for node in self.node_list]
        # Initialize variables for tracking state and performance
        self.game_over = None
        self.budget = None
        self.plan_instance = None
        self.plan_length = None
        self.row_length = 5
        self.best_score = None
        self.best_plan = None
        self.best_node_list = None
        self.move = None
        self.config_dict = None
        # Define action space including all charger types
        self.action_space = spaces.Discrete(5)
        shape = (self.row_length + len(CHARGING_POWER)) * len(self.node_list) + 1
        # Define the observation space for the environment
        self.observation_space = spaces.Box(low=-1, high=1, shape=(shape,), dtype=np.float16)
        # Decide the number of elements that step function returns
        self.env_num = env_num
        self.info = {}  # Initialize a dictionary to record information of each episode
        # Record the frequency of different actions in each episode
        self.actions_counter = None
        self.stepnum_lst, self.actions_lst, self.metrics_lst, self.stationnum_lst, self.capac_list, self.budget_list= [], [], [], [], [], []
    
    def reset(self):
        """
        Reset the environment to its initial state
        """
        self.budget = BUDGET
        self.game_over = False
        # Initialize the plan instance and evaluate initial scores
        self.plan_instance = Plan(self.node_list, Station_Deployment.node_dict, Station_Deployment.cost_dict,
                                  self.plan_file)
        self.best_score, _, _, _, _, _ = normalize_score(self.plan_instance.plan, self.node_list, self.plan_instance.norm_score, 
                                      self.plan_instance.norm_benefit, self.plan_instance.norm_cost, self.plan_instance.norm_travel,
                                      self.plan_instance.norm_charg, self.plan_instance.norm_wait)
        self.plan_length = len(self.plan_instance.existing_plan)
        self.move = 0
        self.best_plan = []
        self.best_node_list = []
        self.config_dict = prepare_config()
        self.actions_counter = [0]*6   # The last one is for random action
        update_node_benefit(self.node_list, self.plan_instance.plan)
        self.info = {}
        obs = self.establish_observation()
        return obs

    def init_node_data(self, node):
        """
        Initialize data for a node including its dictionaries and default values
        """
        Station_Deployment.node_dict[node[0]] = {}
        Station_Deployment.cost_dict[node[0]] = {}
        node[1]["charging_station"] = None
        node[1]["havershine_distance"] = None
        node[1]["driving_distance"] = None
        node[1]["driving_time"] = None
        return node

    def establish_observation(self):
        """
        Build the observation matrix for the current state of the environment
        """
        row_length = self.row_length + len(CHARGING_POWER)
        width = row_length * len(self.node_list) + 1
        obs = np.zeros((width,))
        for j, node in enumerate(self.node_list):
            i = j * row_length
            obs[i + 0] = node[1]['x']
            obs[i + 1] = node[1]['y']
            obs[i + 2] = node[1]['charging_demand']
            obs[i + 3] = node[1]['estate_price']
            obs[i + 4] = node[1]['home_charging']
            for station in self.plan_instance.plan:
                if station[0][0] == node[0]:
                    for e in range(len(CHARGING_POWER)):
                        index = 5 + e
                        obs[i + index] = station[1][e]
                    break
        obs[-1] = self.budget
        obs = np.divide(obs, BUDGET)
        obs = np.asarray(obs, dtype=self.observation_space.dtype)
        return obs

    def budget_adjustment_station(self, station):
        """
        Adjust the budget based on the installation fee of a station
        """
        inst_cost = station[2]["installation_fee"]
        if self.budget - inst_cost > 0:
            # if we have enough money, we build the station
            self.budget -= inst_cost
        else:
            self.game_over = True

    def budget_adjustment_charger(self, config_index):
        """
        Adjust the budget based on the installation fee of a charger
        """
        if self.budget - INSTALL_FEE[config_index] > 0:
            # if we have enough money, we build the charger
            self.budget -= INSTALL_FEE[config_index]
        else:
            self.game_over = True

    def prepare_score(self):
        """
        Loop through the station assignments to update and organize scores
        """
        for j in range(2):
            self.node_list = seeking_station(self.plan_instance.plan, self.node_list, Station_Deployment.node_dict,
                                             Station_Deployment.cost_dict)
            self.node_list = single_travel_time(self.node_list)
            for i in range(len(self.plan_instance.plan)):
                self.plan_instance.plan[i] = single_charging_time(self.plan_instance.plan[i], self.node_list)
                self.plan_instance.plan[i] = single_waiting_time(self.plan_instance.plan[i], self.node_list)


    def step(self, my_action):
        """
        Perform a step in the episode by selecting an action and updating the state
        """
        # Select node
        chosen_node, free_node_list, config_index, action, random_action = self.choose_action(my_action)

        if random_action:
            self.actions_counter[5] += 1  # record random action without optimal choice
            
        else:
            # Build new station
            if chosen_node in free_node_list:
                default_config = initial_solution(self.config_dict, self.node_list, chosen_node)
                station_instance = Station()
                station_instance.add_position(chosen_node)
                station_instance.add_chargers(default_config)
                station_instance.establish_dictionary(self.node_list)
                # Control budget
                self.budget_adjustment_station(station_instance.station)
                if not self.game_over:
                    self.plan_instance.add_plan(station_instance.station)
                    # Record the action
                    self.actions_counter[action] += 1
                    
            # Add charger to existing sation
            else:
                station_index = None
                for station in self.plan_instance.plan:
                    if station[0][0] == chosen_node[0]:
                        station_index = self.plan_instance.plan.index(station)
                        break
                # Control budget
                self.budget_adjustment_charger(config_index)
                if not self.game_over:
                    self.plan_instance.plan[station_index][1][config_index] += 1
                    # Record the action
                    self.actions_counter[action] += 1

        # Evaluate the reward resulted by action using updated node list and plan list as input
        reward = self.action_eval()
        update_node_benefit(self.node_list, self.plan_instance.plan)
        obs = self.establish_observation()

        # Episode end conditions
        if len(self.plan_instance.plan) == len(self.node_list):
            self.game_over = True
        self.move += 1
        if self.move >= len(self.node_list) / 2:
            self.game_over = True
            
        # Return Necessary information
        if self.game_over:
            metrics_prepare = [self.plan_instance.plan, self.node_list, self.plan_instance.basic_cost]  # return for metric calculate later 
            # Firstly update the list
            self.stepnum_lst.append(self.move)
            self.metrics_lst.append(metrics_prepare)
            self.actions_lst.append(self.actions_counter)
            self.stationnum_lst.append(len(self.plan_instance.plan))
            self.capac_list.append(sum([station[2]['capacity'] for station in self.plan_instance.plan]))
            self.budget_list.append((BUDGET - self.budget) / BUDGET * 100)
            self.info = {"num_timesteps": self.stepnum_lst,
                        "metrics_prepare": self.metrics_lst,
                        "actions_counter": self.actions_lst,
                        "station_num": self.stationnum_lst,
                        "total_capacity": self.capac_list,
                        "used_budget (%)": self.budget_list}
        
        if self.env_num == 4:
          return obs, reward, self.game_over, self.info

        if self.env_num == 5:
          return obs, reward, self.game_over, self.info, {}  # self.truncated

    def station_config_check(self, station):
        """
        Ensure no more than K chargers are at the station
        """
        capacity = True
        if sum(station[1]) >= K:
            capacity = False
        return capacity

    def choose_action(self, chosen_action):
        """
        Determine the action to take based on the current state and action choices
        """
        my_action = chosen_action
        config_index = None
        random_action = False
        full_station_list = [s[0][0] for s in self.plan_instance.plan if self.station_config_check(s)
                             is False]  # these are the stations with exactly K chargers
        station_list = [s[0][0] for s in self.plan_instance.plan]  # all charging stations
        occupied_list = [node for node in self.node_list if node[0] not in full_station_list and node[0] in station_list]  # nodes with non-full stations
        free_list = [node for node in self.node_list if node[0] not in station_list]  # nodes without stations
        if 0 <= my_action <= 1:
            # build
            if my_action == 0:
                chosen_node = choose_by_benefit(free_list)
            else:
                chosen_node = choose_by_demand (free_list)
        elif 2 <= my_action <= 3:
            # add column to existing station
            config_index = 1
            if len(occupied_list) == 0:
                chosen_node = choice(free_list)
                random_action = True
            else:
                if my_action == 2:
                    chosen_node = choose_by_benefit(occupied_list)
                else:
                    chosen_node = choose_by_demand (occupied_list)
        else:
            # move station
            steal_plan = [s for s in self.plan_instance.plan if s[0] not in self.plan_instance.existing_plan]
            # we can not steal from the existing charging plan
            stolen_station = relocate_by_benefit(self.node_list, steal_plan)
            if stolen_station is None:
                # only necessary if we take this action in the very beginning
                chosen_node = choice(free_list)
                random_action = True
            else:
                self.budget, config_index = self.plan_instance.relocate_charger(stolen_station, self.budget)
                chosen_node = support_stations(self.plan_instance.plan, free_list)
        return chosen_node, free_list, config_index, my_action, random_action

    def action_eval(self):
        """
        Calculate the reward
        """
        reward = 0
        self.prepare_score()
        new_score, _, _, _, _, _ = normalize_score(self.plan_instance.plan, self.node_list, self.plan_instance.norm_score,
                                  self.plan_instance.norm_benefit, self.plan_instance.norm_cost,
                                  self.plan_instance.norm_travel, self.plan_instance.norm_charg,
                                  self.plan_instance.norm_wait)
        new_score = max(new_score, -25)  # if negative score
        if new_score - self.best_score > 0:
            reward += (new_score - self.best_score)
            self.best_score = new_score
            self.best_plan = self.plan_instance.plan.copy()
            self.best_node_list = self.node_list.copy()
        return reward

    def render(self, mode='human', close=False):
        """
        Render the environment to the screen
        """
        print(f'Normalized Score is: {self.best_score*100}')
        print(f'Number of stations in charging plan: {len(self.plan_instance.plan)}')
        return self.best_node_list, self.best_plan