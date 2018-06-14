(function () {
    'use strict';

    const i_tournamentId = document.getElementById('tournamentId');

    const b_fetchTournament = document.getElementById('fetchTournament');

    b_fetchTournament.addEventListener('click', () => {
        const tournamentId = i_tournamentId.value;

        if (tournamentId !== "") {
            b_fetchTournament.classList.remove('is-success');
            b_fetchTournament.classList.remove('is-danger');
            b_fetchTournament.classList.add('is-loading');
            b_fetchTournament.disabled = true;
            //axios.get('http://cobr.ai/tournaments/' + tournamentId + '.json')
            axios.get('../shared/tournament.json')
                .then(response => {
                    nodecg.Replicant('tournamentData').value = response.data;
                    b_fetchTournament.classList.remove('is-loading');
                    b_fetchTournament.classList.add('is-success');
                    b_fetchTournament.disabled = false;
                })
                .catch(error => {
                    b_fetchTournament.classList.remove('is-loading');
                    b_fetchTournament.classList.add('is-danger');
                    b_fetchTournament.disabled = false;
                });
        }
    });
})();