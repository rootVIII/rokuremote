class LoadingAnimation {
    constructor() {
        this.requestID = null;
        this.clock = 0;
        this.status = document.getElementById('statusMessage');
        this.status.innerHTML = 'Searching for Roku devices...';
        this.opacity = 0.0;
        this.direction = 'in';
        this.status.style.opacity = this.opacity;
    }

    updateText() {
        if (this.clock % 3 === 0) {
            if (this.direction === 'in') {
                if (this.opacity < 1.0) {
                    this.opacity += 0.05;
                } else {
                    this.direction = 'out';
                }
            } else if (this.direction === 'out') {
                if (this.opacity > 0.0) {
                    this.opacity -= 0.05;
                } else {
                    this.direction = 'in';
                }
            }

            this.status.style.opacity = this.opacity;
        }
    }

    stop() {
        window.cancelAnimationFrame(this.requestID);
        this.status.innerHTML = '&emsp;';
        this.status.style.opacity = 1.0;
    }

    start() {
        this.requestID = window.requestAnimationFrame(this.start.bind(this));
        this.updateText();
        this.clock++;
    }
}

let load = new LoadingAnimation();

async function loadDevices() {
    const resp = await fetch('/get-devices', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    const response = await resp.json();

    if (Object.keys(response).length) {
        console.log(response);

        let selectBoxDiv = document.getElementById('dropDownDiv');
        let selectBox = document.createElement('select');
        selectBox.id = 'deviceSelect';
        selectBoxDiv.appendChild(selectBox);

        let dropDown = document.getElementById('deviceSelect');
        let defaultOpt = document.createElement('option');
        defaultOpt.id = 'selectDevice';
        defaultOpt.value = 'selectDevice';
        defaultOpt.innerHTML = 'Select Device';
        dropDown.appendChild(defaultOpt);

        let index = 1;
        Object.entries(response).forEach(([ip, deviceName]) => {
            let newOpt = document.createElement('option');
            newOpt.id = `ip${index}`;
            newOpt.value = ip;
            newOpt.innerHTML = deviceName;
            dropDown.appendChild(newOpt);
            index++;
        });
        load.stop();
    }
}

function pollDevices(pollIndex) {
    setTimeout(() => {
        if (!(document.getElementById('deviceSelect')) && pollIndex > 0) {
            loadDevices();
            pollDevices(--pollIndex);
        }
    }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
    pollDevices(128);
    load.start();
});
