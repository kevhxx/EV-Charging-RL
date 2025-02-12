import geopandas as gpd
import folium
import osmnx as ox
from shapely.ops import unary_union
from shapely.geometry import Polygon
import webbrowser

# Load the research area boundary
file_path = "Research_area.geojson"
Research_area_gdf = gpd.read_file(file_path).to_crs(epsg=4326)

# Load London's administrative boundary
london_gdf = ox.geocode_to_gdf("London, UK")

# Ensure the City of London is not treated as a hole in Greater London
london_geom = london_gdf.geometry.iloc[0]

# Convert to a single polygon to merge all sub-regions (fixes the City of London issue)
london_geom = Polygon(london_geom.exterior)

# Save back into a new GeoDataFrame
london_gdf = gpd.GeoDataFrame(geometry=[london_geom], crs=london_gdf.crs)

# Merge all parts of London into one geometry
london_geometry = unary_union(london_gdf.geometry)

# Load the Ultra-Low Emission Zone (ULEZ) boundary
ulez_file = "LondonWideUltraLowEmissionZone.geojson"  # Ensure this file exists in your working directory
ULEZ_gdf = gpd.read_file(ulez_file).to_crs(epsg=4326)

# Convert the research area to a projected CRS for centroid calculation
projected_gdf = Research_area_gdf.to_crs(epsg=3857)  # Web Mercator projection
center_lat = projected_gdf.geometry.centroid.to_crs(epsg=4326).y.mean()
center_lon = projected_gdf.geometry.centroid.to_crs(epsg=4326).x.mean()

london_gdf["name"] = "Greater London"

# Create map centered in London
m = folium.Map(location=[center_lat, center_lon], zoom_start=10)

# Add Greater London boundary (ensuring no City of London cutout)
folium.GeoJson(
    london_gdf,
    name="Greater London Boundary",
    style_function=lambda x: {
        "fillColor": "none",
        "color": "black",  # Outer boundary only
        "weight": 2,
        "fillOpacity": 1,   
    },
    tooltip=folium.GeoJsonTooltip(fields=["name"], aliases=["Region:"])  # Now "name" exists
).add_to(m)

# Add ULEZ Boundary
folium.GeoJson(
    ULEZ_gdf,
    name="Ultra Low Emission Zone (ULEZ)",
    style_function=lambda feature: {
        "fillColor": "blue",
        "color": "blue",
        "weight": 2,
        "fillOpacity": 0.2,  # Semi-transparent for visibility
    },
    tooltip=folium.GeoJsonTooltip(fields=["BOUNDARY"], aliases=["ULEZ Zone:"])
).add_to(m)

# Add research area boundaries with different colors and tooltips
colors = ["red", "blue", "green", "purple", "orange"]
for idx, row in Research_area_gdf.iterrows():
    color = colors[idx % len(colors)]
    tooltip_name = row.get('DESCRIPTIO', 'Unknown')  # Use 'DESCRIPTIO' instead of 'name'
    folium.GeoJson(
        Research_area_gdf,  # Pass the full GeoDataFrame, NOT row.geometry
        name="Research Area",
        style_function=lambda feature: {  # Feature is now used properly
            "fillColor": "red",
            "color": "black",
            "weight": 1.5,
            "fillOpacity": 0.4,
        },
        tooltip=folium.GeoJsonTooltip(fields=["DESCRIPTIO"], aliases=["Research Area:"])
    ).add_to(m)



# Add layer control
folium.LayerControl().add_to(m)

# Save the map as an HTML file
output_file = "London_Research_Area_Map.html"
m.save(output_file)

print(f"Map saved as {output_file}. Open it in a web browser to view.")


webbrowser.open("London_Research_Area_Map.html")