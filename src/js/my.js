let currentPage = 0;
const pageSizeSelect = document.getElementById('pageSize');

function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function validateForm() {
    const name = $('#name').val().trim();
    const title = $('#title').val().trim();
    const level = parseInt($('#level').val(), 10);
    const birthday = $('#birthday').val();

    if (name.length < 1 || name.length > 12) {
        alert('Name must be 1–12 characters long');
        return false;
    }
    if (title.length < 1 || title.length > 30) {
        alert('Title must be 1–30 characters long');
        return false;
    }
    if (isNaN(level) || level < 0 || level > 100) {
        alert('Level must be a number between 0 and 100');
        return false;
    }
    if (!birthday) {
        alert('Please select a birthday');
        return false;
    }
    return true;
}

// Load players list with pagination
function loadPlayers(pageNumber) {
    currentPage = pageNumber;
    const pageSize = parseInt(pageSizeSelect.value);

    // Показываем индикатор загрузки
    $('#playersBody').empty().append('<tr><td colspan="10" style="text-align: center; padding: 20px;">Loading...</td></tr>');

    $.get(`/rest/players?pageNumber=${pageNumber}&pageSize=${pageSize}`, function (data) {
        const tbody = $('#playersBody');
        tbody.empty();

        // Если данных нет, показываем сообщение
        if (data.length === 0) {
            tbody.append('<tr><td colspan="10" style="text-align: center; padding: 20px;">No players found</td></tr>');
            return;
        }

        data.forEach(player => {
            const row = $('<tr>');

            row.append($('<td>').text(player.id || 'N/A'));
            row.append($('<td>').text(player.name || 'N/A'));
            row.append($('<td>').text(player.title || 'N/A'));
            row.append($('<td>').text(player.race || 'N/A'));
            row.append($('<td>').text(player.profession || 'N/A'));
            row.append($('<td>').text(player.level || 'N/A'));

            const birthdayText = player.birthday ? formatDate(player.birthday) : 'N/A';
            row.append($('<td>').text(birthdayText));
            row.append($('<td>').text(player.banned ? 'Yes' : 'No'));

            // Edit column
            const editCell = $('<td>');
            const editBtn = $('<img>')
                .attr('src', '../img/edit.png')
                .addClass('edit-btn')
                .data('player', player)
                .click(function () {
                    editPlayer($(this).data('player'));
                });
            editCell.append(editBtn);
            row.append(editCell);

            // Delete column
            const deleteCell = $('<td>');
            const deleteBtn = $('<img>')
                .attr('src', '../img/delete.png')
                .addClass('delete-btn')
                .data('id', player.id)
                .click(function () {
                    deletePlayer($(this).data('id'));
                });
            deleteCell.append(deleteBtn);
            row.append(deleteCell);

            tbody.append(row);
        });

        updatePagination();
    }).fail(function (error) {
        console.error('Error loading players:', error);
        $('#playersBody').empty().append('<tr><td colspan="10" style="text-align: center; color: red;">Error loading data</td></tr>');
    });
}

// Load total players count for pagination calculation
function loadPlayersCount() {
    $.get('/rest/players/count', function (count) {
        window.totalPlayers = count;
        updatePagination();
    }).fail(function (error) {
        console.error('Error loading players count:', error);
    });
}

// Update pagination buttons
function updatePagination() {
    const pageSize = parseInt(pageSizeSelect.value);
    const totalPages = Math.ceil(window.totalPlayers / pageSize);
    const pageButtonsContainer = $('#pageButtons');
    pageButtonsContainer.empty();

    for (let i = 0; i < totalPages; i++) {
        const btn = $('<button>')
            .addClass('page-btn')
            .text(i + 1)
            .click(function () {
                loadPlayers(i);
            });

        if (i === currentPage) {
            btn.addClass('active');
        }

        pageButtonsContainer.append(btn);
    }
}

// Delete player
function deletePlayer(id) {
    if (!confirm('Are you sure you want to delete this account?')) {
        return;
    }

    $.ajax({
        url: `/rest/players/${id}`,
        type: 'DELETE',
        success: function () {
            alert('Account deleted successfully');
            loadPlayers(currentPage); // Reload current page
        },
        error: function (error) {
            console.error('Error deleting player:', error);
            alert('Error deleting account');
        }
    });
}

// Edit player
function editPlayer(player) {
    const row = $(`#playersTable tr:has(td:contains('${player.id}'))`);
    const cells = row.find('td');

    // Hide Delete button
    cells.eq(-1).find('.delete-btn').hide();

    // Change Edit icon to Save
    const editBtn = cells.eq(-2).find('.edit-btn');
    editBtn.attr('src', '../img/save.png').removeClass('edit-btn').addClass('save-btn');

    // Make fields editable
    cells.eq(1).html(`<input type="text" value="${player.name}" class="edit-field" data-field="name">`);
    cells.eq(2).html(`<input type="text" value="${player.title}" class="edit-field" data-field="title">`);
    cells.eq(3).html(`
        <select class="edit-field" data-field="race">
            <option value="HUMAN" ${player.race === 'HUMAN' ? 'selected' : ''}>Human</option>
            <option value="DWARF" ${player.race === 'DWARF' ? 'selected' : ''}>Dwarf</option>
            <option value="ELF" ${player.race === 'ELF' ? 'selected' : ''}>Elf</option>
            <option value="GIANT" ${player.race === 'GIANT' ? 'selected' : ''}>Giant</option>
            <option value="ORC" ${player.race === 'ORC' ? 'selected' : ''}>Orc</option>
            <option value="TROLL" ${player.race === 'TROLL' ? 'selected' : ''}>Troll</option>
            <option value="HOBBIT" ${player.race === 'HOBBIT' ? 'selected' : ''}>Hobbit</option>
        </select>
    `);
    cells.eq(4).html(`
        <select class="edit-field" data-field="profession">
            <option value="WARRIOR" ${player.profession === 'WARRIOR' ? 'selected' : ''}>Warrior</option>
            <option value="ROGUE" ${player.profession === 'ROGUE' ? 'selected' : ''}>Rogue</option>
            <option value="SORCERER" ${player.profession === 'SORCERER' ? 'selected' : ''}>Sorcerer</option>
            <option value="CLERIC" ${player.profession === 'CLERIC' ? 'selected' : ''}>Cleric</option>
            <option value="PALADIN" ${player.profession === 'PALADIN' ? 'selected' : ''}>Paladin</option>
            <option value="NAZGUL" ${player.profession === 'NAZGUL' ? 'selected' : ''}>Nazgul</option>
            <option value="WARLOCK" ${player.profession === 'WARLOCK' ? 'selected' : ''}>Warlock</option>
            <option value="DRUID" ${player.profession === 'DRUID' ? 'selected' : ''}>Druid</option>
        </select>
    `);
    cells.eq(5).html(`<input type="number" value="${player.level}" class="edit-field" data-field="level" min="0" max="100">`);
    cells.eq(6).html(`
        <input type="date"
               value="${new Date(player.birthday).toISOString().split('T')[0]}"
               class="edit-field"
               data-field="birthday">
    `);
    cells.eq(7).html(`<input type="checkbox" class="edit-field" data-field="banned" ${player.banned ? 'checked' : ''}>`);

    // Save button handler
    editBtn.off('click').click(function () {
        savePlayer(player.id, row);
    });
}

// Save player changes
function savePlayer(id, row) {
    const updatedData = {};
    row.find('.edit-field').each(function () {
        const field = $(this).data('field');
        let value = $(this).is(':checkbox') ? $(this).prop('checked') : $(this).val();

        // Special handling for birthday field
        if (field === 'birthday' && value) {
            value = new Date(value).getTime();
        }

        updatedData[field] = value;
    });

    $.ajax({
        url: `/rest/players/${id}`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(updatedData),
        success: function () {
            alert('Changes saved successfully');
            loadPlayers(currentPage);
        },
        error: function (error) {
            console.error('Error saving player:', error);
            alert('Error saving changes');
        }
    });
}

// Create new player
$('#createPlayerForm').submit(function (e) {
    e.preventDefault();

    // Валидация перед отправкой
    if (!validateForm()) {
        return;
    }

    const newPlayer = {
        name: $('#name').val().trim(),
        title: $('#title').val().trim(),
        race: $('#race').val(),
        profession: $('#profession').val(),
        level: parseInt($('#level').val(), 10),
        birthday: new Date($('#birthday').val()).getTime(),
        banned: $('#banned').is(':checked')
    };

    $.ajax({
        url: '/rest/players',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(newPlayer),
        success: function (createdPlayer) {
            alert('Player created successfully');
            $('#createPlayerForm')[0].reset();
            loadPlayers(currentPage);
            loadPlayersCount();
        },
        error: function (xhr, status, error) {
            console.error('Error creating player:', xhr.status, error);

            let errorMessage = 'Error creating player';
            if (xhr.status === 400) {
                errorMessage = 'Invalid data. Please check the form fields.';
            } else if (xhr.status === 500) {
                errorMessage = 'Server error. Please try again later.';
            }
            alert(errorMessage);
        }
    });
});

// Инициализация при загрузке страницы
$(document).ready(function () {
    // Загружаем первую страницу игроков
    loadPlayers(0);
    // Загружаем общее количество игроков для пагинации
    loadPlayersCount();

    // Обработчик изменения размера страницы
    $('#pageSize').change(function () {
        loadPlayers(currentPage);
    });
});
