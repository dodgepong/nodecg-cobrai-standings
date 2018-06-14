(function () {
    'use strict';

    const pageSize = 8;
    var pageCount = 0;

    const i_tournamentId = document.getElementById('tournamentId');

    const navContainer = document.getElementById('navContainer')
    const b_fetchTournament = document.getElementById('fetchTournament');

    const r_tournamentData = nodecg.Replicant('tournamentData');

    nodecg.readReplicant('tournamentData', data => {
        if (data !== null) {
            i_tournamentId.value = data.tournamentId;
        }
	});

    function goToPage(pageNumber) {
        r_tournamentData.value.page = pageNumber;

        var prevButton = document.getElementById('prev');
        prevButton.disabled = false;
        var nextButton = document.getElementById('next');
        nextButton.disabled = false;

        var allPages = document.querySelectorAll('.pagination-link');
        allPages.forEach(link => {
            link.classList.remove('is-current');
        });
        document.getElementById("page" + pageNumber).classList.add('is-current');

        if (pageNumber == 1) {
            prevButton.disabled = true;
        }
        if (pageNumber == pageCount) {
            nextButton.disabled = true;
        }
    }

    function goToPrevious() {
        const currentPage = r_tournamentData.value.page;
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    }

    function goToNext() {
        const currentPage = r_tournamentData.value.page;
        if (currentPage < pageCount) {
            goToPage(currentPage + 1);
        }
    }

    function createNavPage(pageNumber) {
        var pageLink = document.createElement('a');
        pageLink.id = "page" + pageNumber;
        pageLink.classList.add('pagination-link');
        if (pageNumber == 1) {
            pageLink.classList.add('is-current');
        }
        pageLink.innerHTML = pageNumber;
        pageLink.addEventListener('click', () => {
            goToPage(pageNumber);
        });

        var pageItem = document.createElement('li');
        pageItem.appendChild(pageLink);

        return pageItem;
    }

    function createNav(players) {
        pageCount = Math.ceil(players.length / pageSize);

        while (navContainer.firstChild) {
            navContainer.removeChild(navContainer.firstChild);
        }

        var prevLink = document.createElement('button');
        prevLink.id = "prev";
        prevLink.classList.add('pagination-link');
        prevLink.classList.add('button');
        prevLink.disabled = true;
        prevLink.innerHTML = "&lt;";
        prevLink.addEventListener('click', () => {
            goToPrevious();
        });

        var nextLink = document.createElement('button');
        nextLink.id = "next";
        nextLink.classList.add('pagination-link');
        nextLink.classList.add('button');
        nextLink.innerHTML = "&gt;";
        nextLink.addEventListener('click', () => {
            goToNext();
        });

        var navItem = document.createElement('nav');
        navItem.classList.add('pagination');
        navItem.classList.add('is-centered');

        var pageList = document.createElement('ul');
        pageList.classList.add('pagination-list');

        for (var i = 1; i <= pageCount; i++) {
            pageList.appendChild(createNavPage(i));
        }

        navItem.appendChild(prevLink);
        navItem.appendChild(pageList);
        navItem.appendChild(nextLink);

        navContainer.appendChild(navItem);
    }

    b_fetchTournament.addEventListener('click', () => {
        const tournamentId = i_tournamentId.value;

        if (tournamentId !== "") {
            b_fetchTournament.classList.remove('is-success');
            b_fetchTournament.classList.remove('is-danger');
            b_fetchTournament.classList.add('is-loading');
            b_fetchTournament.disabled = true;
            axios.get('http://cobr.ai/tournaments/' + tournamentId + '.json')
                .then(response => {
                    r_tournamentData.value = {
                        data: response.data,
                        page: 1,
                        tournamentId: tournamentId
                    };
                    createNav(response.data.players);
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