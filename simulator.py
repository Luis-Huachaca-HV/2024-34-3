# simulator.py
import multiprocessing
import random
from producer import send_data

# Simulamos 10 camiones aleatorios
vehicle_ids = list(range(10, 500))  # depende de los vehicle_id del dataset
selected = random.sample(vehicle_ids, 10)

if __name__ == '__main__':
    processes = []
    for v_id in selected:
        p = multiprocessing.Process(target=send_data, args=(v_id,))
        p.start()
        processes.append(p)

    for p in processes:
        p.join()
