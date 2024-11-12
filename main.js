// Function to get US federal holidays for a given year
function getHolidays(year) {
    const holidays = [
        // New Year's Day
        new Date(year, 0, 1),
        // Martine Luther King Jr. Day (3rd Monday in January)
        new Date(year, 0, 1 + (15 - new Date(year, 0, 1).getDay() + 7) % 7),
        // Presidents Day (3rd Monday in February)
        new Date(year, 1, 1 + (15 - new Date(year, 1, 1).getDay() + 7) % 7),
        // Memorial Day (Last Monday in May)
        new Date(year, 5, 19),
        // Independence Day
        new Date(year, 6, 4),
        // Labor Day (1st Monday in September)
        new Date(year, 8, 1 + (1 - new Date(year, 8, 1).getDay() + 7) % 7),
        // Columbus Day (2nd Monday in October)
        new Date(year, 9, 1 + (8 - new Date(year, 9, 1).getDay() + 7) % 7),
        // Veterans Day
        new Date(year, 10, 11),
        // Thanksgiving Day (4th Thursday in November)
        new Date(year, 10, 1 + (22 - new Date(year, 10, 1).getDay() + 7) % 7),
        // Christmas Day
        new Date(year, 12, 25)
    ];

    // Adjust for weekends
    return holidays.map(holiday => {
        const day = holiday.getDay();
        if (day === 0) { // If holiday falls on Sunday, observe on Monday
            return new Date(holiday.getTime() + 86400000);
        } else if (day === 6) { // If holiday falls on Saturday, observe on Friday
            return new Date(holiday.getTime() - 86400000);
        }
        return holiday;
    });
}

// Function to check if a date is a holiday
function isHoliday(date, holidays) {
    return holidays.some(holiday =>
        holiday.getFullYear() === date.getFullYear() && 
        holiday.getMonth() === date.getMonth() && 
        holiday.getDate() === date.getDate()
    );
}

// Display holidays for current year
function displayHolidays() {
    const currentYear = new Date().getFullYear();
    const holidays = getHolidays(currentYear);
    const holidaysList = document.getElementById('holidaysObserved');
    holidaysList.innerHTML = '';

    const holidayNames = [
        "New Year's Day", "Martin Luther King Jr. Day", "Presidents Day", "Memorial Day",
        "Juneteenth", "Independence Day", "Labor Day", "Columbus Day", "Veterans Day", 
        "Thanksgiving Day", "Christmas Day"
    ];

    holidays.forEach((holiday, index) => {
        const li = document.createElement('li');
        li.textContent = `${holidayNames[index]}: ${holiday.toLocaleDateString()}`;
        holidaysList.appendChild(li);
    });
}

function calculateBusinessDays() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const error = document.getElementById('error');
    const result = document.getElementById('result');
    const details = document.getElementById('details');

    // Reset displays
    error.style.display = 'none';
    result.style.display = 'none';
    details.style.display = 'none';

    // Validate dates
    if (!startDate.getTime() || !endDate.getTime()) {
        error.textContent = 'Please select both dates.';
        error.style.display = 'block';
        return;
    }

    if (endDate < startDate) {
        error.textContent = 'End date must be after start date.';
        error.style.display = 'block';
        return;
    }

    const holidays = [];
    for (let year = startDate.getFullYear(); year <= endDate.getFullYear(); year++) {
        holidays.push(...getHolidays(year));
    }

    let businessDays = 0;
    let skippedDays = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const holidayCheck = isHoliday(currentDate, holidays);

        if (!isWeekend && !holidayCheck) {
            businessDays++;
        } else if (isWeekend) {
            skippedDays.push(`${currentDate.toLocaleDateString()} (Weekend)`);
        } else if (holidayCheck) {
            skippedDays.push(`${currentDate.toLocaleTimeString()} (Holiday)`);
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Display result
    result.textContent = `There are ${businessDays} business day${businessDays !== 1 ? 's' : ''} between the selected dates.`;
    result.style.display = 'block';

    // Show details of skipped days
    if (skippedDays.length > 0) {
        details.innerHTML = '<h3>Skipped Days:</h3><ul>' +
            skippedDays.map(day => `<li>${day}</li>`).join('') +
            '</ul>';
        details.style.display = 'block';
    }
}

// Display holidays when page loads
displayHolidays();