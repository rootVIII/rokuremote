/* eslint-disable no-unused-vars */
async function pressedKey(keyID) {
    /* eslint-enable no-unused-vars */

    const ip = document.getElementById('deviceSelect').value;
    const statusMessageElement = document.getElementById('statusMessage');

    if (ip !== 'selectDevice') {
        const resp = await fetch('/sendkey', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ IP: ip, KeyID: keyID }),
        });

        const response = await resp.json();

        if (response.length) {
            statusMessageElement.innerHTML = response.ERROR;
            setTimeout(() => { statusMessageElement.innerHTML = '&thinsp;'; }, 5000);
        } else {
            statusMessageElement.innerHTML = '&thinsp;';
        }
    } else {
        statusMessageElement.innerHTML = 'Invalid Roku IP...';
        setTimeout(() => { statusMessageElement.innerHTML = '&thinsp;'; }, 5000);
    }
}
