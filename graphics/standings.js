(function () {
    'use strict';

    const pageSize = 8;

    const delayTime = 0.5;

    const o_standingsHeader = document.getElementById('standingsHeader');
    const o_standingsSubHeader = document.getElementById('standingsSubHeader');
    const o_standings = document.getElementById('standings');

    const r_tournamentData = nodecg.Replicant('tournamentData');

    function fadeOut() {
        TweenMax.to('#standings', delayTime, { opacity: 0 })
    }

    function fadeIn() {
        TweenMax.to('#standings', delayTime, { opacity: 1 })
    }

    function removeSubtitle(name) {
        var lastColonIndex = name.lastIndexOf(':');
        if (lastColonIndex !== -1) {
            var noSubtitle = name.substring(0, lastColonIndex);
            if (noSubtitle !== 'NBN' && noSubtitle !== 'Haas-Bioroid' && noSubtitle !== 'Jinteki' && noSubtitle !== 'Weyland Consortium') {
                return noSubtitle;
            }
        }
        return name;
    }

    function findLatestCompletedRound(rounds) {
        var latestRound = 0;

        var finishedRounds = rounds.filter(round => {
            if (round[0].eliminationGame) {
                return false;
            }

            var unfinishedgames = round.filter(game => {
                if (game.player1.combinedScore === null || game.player2.combinedScore === null) {
                    return true;
                }
            });

            if (unfinishedgames.length > 0) {
                return false;
            }

            return true;
        })

        return finishedRounds.length;
    }

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
        corpDiv.innerHTML = removeSubtitle(player.corpIdentity);

        var runnerDiv = document.createElement('div');
        runnerDiv.classList.add('identity');
        runnerDiv.classList.add('runner');
        runnerDiv.innerHTML = removeSubtitle(player.runnerIdentity);

        var identitiesDiv = document.createElement('div');
        identitiesDiv.classList.add('identities');
        identitiesDiv.appendChild(corpDiv);
        identitiesDiv.appendChild(runnerDiv);

        var prestigeDiv = document.createElement('div');
        prestigeDiv.classList.add('prestige');
        prestigeDiv.innerHTML = player.matchPoints;

        var sosDiv = document.createElement('div');
        sosDiv.classList.add('sos');
        sosDiv.innerHTML = Math.round(player.strengthOfSchedule * 1000) / 1000;


        var standingDiv = document.createElement('div');
        standingDiv.classList.add('standing');
        standingDiv.appendChild(rankDiv);
        standingDiv.appendChild(playerNameDiv);
        standingDiv.appendChild(identitiesDiv);
        standingDiv.appendChild(prestigeDiv);
        standingDiv.appendChild(sosDiv);

        return standingDiv;
    }

    function getPage(players, pageNumber) {
        var page = [];

        const startingIndex = ((pageNumber - 1) * pageSize);
        const nextPageStartingIndex = pageNumber * pageSize;
        if (startingIndex > players.length) {
            // page doesn't exist
            return [];
        }

        for (var i = startingIndex; i < nextPageStartingIndex; i++) {
            if (typeof players[i] === 'undefined') {
                break;
            }
            page.push(createStanding(players[i]));
        }

        return page;
    }

    function updateStandingsDisplay() {
        const newData = r_tournamentData.value;
        while (o_standings.firstChild) {
            o_standings.removeChild(o_standings.firstChild);
        }

        getPage(newData.data.players, newData.page).forEach(item => {
            o_standings.appendChild(item);
        });
        fadeIn();
    }

    r_tournamentData.on('change', newData => {
        if (newData !== null && newData !== undefined) {
            const currentRound = findLatestCompletedRound(newData.data.rounds);
            if (currentRound === 0) {
                o_standingsHeader.innerHTML = "Entries";
            } else {
                o_standingsHeader.innerHTML = "Current Standings as of Round " + currentRound;
            }
            o_standingsSubHeader.innerHTML = "" + newData.data.players.length + " Players - " + newData.data.links[1].href;

            fadeOut();
            window.setTimeout(updateStandingsDisplay, 1000 * delayTime);
        }
    });
})();