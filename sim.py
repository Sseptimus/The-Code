import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider, Button, RadioButtons

STRAINS = {
    "Original" : 2.5,
    "Alpha" : 3.225,
    "Beta" : 3.125,
    "Gamma" : 3.45,
    "Delta" : 4.925
}

STRAIN = "Original"

ASYMPTOMATIC_LENGTH = 3
SYMPTOM_LENGTH = 10
DETECTION_PROB = 0

R = STRAINS[STRAIN]

def run_simulation():
    sim_R = R

    total = 1000
    susceptible = 995
    infected = 5
    symptomatic = 0
    quarantined = 0
    removed = 0

    data = [[susceptible, infected, symptomatic, quarantined, removed]]
    t_left = 0

    while infected + symptomatic > 0:
        quarantined_recoveries = np.random.binomial(quarantined, 1 / (SYMPTOM_LENGTH + 1))
        removed += quarantined_recoveries
        quarantined -= quarantined_recoveries

        new_quarantined = np.random.binomial(symptomatic, DETECTION_PROB)
        quarantined += new_quarantined
        symptomatic -= new_quarantined

        new_infections = np.random.binomial(susceptible, sim_R / (SYMPTOM_LENGTH + 1) * symptomatic / total)
        new_symptomatics = np.random.binomial(infected, 1 / (ASYMPTOMATIC_LENGTH + 1))
        recoveries = np.random.binomial(symptomatic, 1 / (SYMPTOM_LENGTH + 1))

        susceptible -= new_infections
        infected -= new_symptomatics
        symptomatic -= recoveries

        infected += new_infections
        symptomatic += new_symptomatics
        removed += recoveries
        data.append([susceptible, infected, symptomatic, quarantined, removed])

        t_left -= 1

        """if t_left <= 0:
            sim_R = 2.5

        if symptomatic > 50:
            sim_R = 0.8
            t_left = 14"""

    susceptible_data = np.array([p[0] for p in data])
    infected_data = np.array([p[1] for p in data])
    symptomatic_data = np.array([p[2] for p in data])
    quarantined_data = np.array([p[3] for p in data])
    removed_data = np.array([p[4] for p in data])

    return susceptible_data, infected_data, symptomatic_data, quarantined_data, removed_data

fig = plt.figure(1)

ax1 = fig.add_subplot(111)
fig.subplots_adjust(left = 0.2)

axamp = plt.axes([0.1, 0.02, 0.55, 0.05])
button_axes = plt.axes([0.7, 0.02, 0.2, 0.05])
strain_axes = plt.axes([0.05, 0.35, 0.1, 0.3])

testing_slider = Slider(axamp,"Quarantine Prob", 0.0, 0.2, 0.)
button = Button(button_axes, "Resimulate")
strain_rb = RadioButtons(strain_axes, STRAINS.keys())

def strain_update(value):
    global R
    R = STRAINS[value]
    update()

def update(*args):
    global DETECTION_PROB
    DETECTION_PROB = testing_slider.val
    ax1.clear()

    datas = list(run_simulation())

    datas[2] += datas[1]
    datas[3] += datas[2]
    datas[0] += datas[3]
    datas[4] += datas[0]

    x = np.arange(datas[0].size)

    ax1.fill_between(x, datas[4], color = "#777777", label = "Removed")
    ax1.fill_between(x, datas[0], color = "blue", label = "Susceptible")
    ax1.fill_between(x, datas[3], color = "purple", label = "Quarantined")
    ax1.fill_between(x, datas[2], color = "red", label = "Symptomatic")
    ax1.fill_between(x, datas[1], color = "orange", label = "Exposed")
    ax1.legend()

    fig.canvas.draw_idle()

testing_slider.on_changed(update)
button.on_clicked(update)
strain_rb.on_clicked(strain_update)
update()

plt.show()