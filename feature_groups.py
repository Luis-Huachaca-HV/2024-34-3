# simulator/utils/feature_groups.py
motor_cols = ['171_0', '666_0', '427_0']
emissions_cols = ['837_0'] + [f'167_{i}' for i in range(10)]
transmission_cols = [f'272_{i}' for i in range(10)] + [f'291_{i}' for i in range(11)]
brakes_cols = [f'158_{i}' for i in range(10)] + ['370_0']
performance_cols = ['309_0', '835_0'] + [f'459_{i}' for i in range(20)]
telemetry_cols = ['100_0'] + [f'397_{i}' for i in range(36)]

all_families = {
    'motor-data': motor_cols,
    'emissions-data': emissions_cols,
    'transmission-data': transmission_cols,
    'brakes-data': brakes_cols,
    'performance-data': performance_cols,
    'telemetry-data': telemetry_cols
}
