import numpy as np
from Cost_Function import waiting_inf



"""
Parameters for Constraints
"""
K = 24  # maximal number of chargers at a station
INSTALL_FEE = np.array([450, 600, 25000])  # fee per installing a charger of level 1, 2 or 3. £
BUDGET = 1.25 * 10 ** 6  # £
price_parkingplace = 200 * 3.5 * 2  # £

def installment_fee(station):
    """
    returns cost to install the respective chargers at that position
    """
    s_pos, s_x, s_dict = station[0], station[1], station[2]
    charger_cost = np.sum(INSTALL_FEE * s_x)
    fee = price_parkingplace * s_pos[1]['estate_price'] + charger_cost
    s_dict["installation_fee"] = fee
    return station

def station_capacity_check(plan_list):
    """
    check if number of stations exceed capacity
    """
    for station in plan_list:
        s_x = station[1]
        if sum(s_x) > K:
            print("Error: More chargers at the station than admitted: {} chargers".format(sum(s_x)))

def installment_cost_check(plan_list, my_basic_cost):
    """
    check if instalment costs exceed budget
    """
    total_inst_cost = sum([station[2]["installation_fee"] for station in plan_list]) - my_basic_cost
    if total_inst_cost > BUDGET:
        print("Error: Maximal BUDGET for installation costs exceeded.")


def control_charg_decision(plan_list, node_list):
    for node in node_list:
        station_sum = sum([1 for station in plan_list if node[1]["charging_station"] == station[0]])
        if station_sum > 1:
            print("Error: More than one station is assigned to a node.")


def waiting_time_check(plan_list):
    """
    check that wiating time is bounded
    """
    for station in plan_list:
        s_dict = station[2]
        if s_dict["waiting_time"] == waiting_inf:
            print("Error: Waiting time goes to infinity.")


def constraint_check(plan_list, node_list, basic_cost):
    """
    test if solution satisfies all constraints
    """
    installment_cost_check(plan_list, basic_cost)
    control_charg_decision(plan_list, node_list)
    station_capacity_check(plan_list)
    waiting_time_check(plan_list)