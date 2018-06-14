(function () {
    'use strict';

    const o_standings = document.getElementById('standings');

    const r_tournamentData = nodecg.Replicant('tournamentData');

    function createStanding(player) {
        var rankDiv = document.createElement('div');
        rankDiv.classList.add('rank');
        rankDiv.innerHTML = player.rank;

        var playerNameDiv = document.createElement('div');
        playerNameDiv.classList.add('player-name');
        playerNameDiv.innerHTML = player.name;

        var corpDiv = document.createElement('div');
        corpDiv.classList.add('identity');
        corpDiv.classList.add('corp');
        corpDiv.innerHTML = player.corpIdentity;

        var runnerDiv = document.createElement('div');
        runnerDiv.classList.add('identity');
        runnerDiv.classList.add('runner');
        runnerDiv.innerHTML = player.runnerIdentity;

        var identitiesDiv = document.createElement('div');
        identitiesDiv.classList.add('player-name');
        identitiesDiv.appendChild(corpDiv);
        identitiesDiv.appendChild(runnerDiv);

        var prestigeDiv = document.createElement('div');
        prestigeDiv.classList.add('prestige');
        prestigeDiv.innerHTML = player.matchPoints;

        var sosDiv = document.createElement('div');
        sosDiv.classList.add('sos');
        sosDiv.innerHTML = player.strengthOfSchedule;


        var standingDiv = document.createElement('div');
        standingDiv.classList.add('standing');
        standingDiv.appendChild(rankDiv);
        standingDiv.appendChild(playerNameDiv);
        standingDiv.appendChild(identitiesDiv);
        standingDiv.appendChild(prestigeDiv);
        standingDiv.appendChild(sosDiv);

        return standingDiv;
    }

    r_tournamentData.on('change', newData => {
        if (newData !== null && newData !== undefined) {
            while (o_standings.firstChild) {
                o_standings.removeChild(o_standings.firstChild);
            }
            for (var i = 0; i < 8; i++) {
                o_standings.appendChild(createStanding(newData.players[i]));
            }
        }
    });
})();