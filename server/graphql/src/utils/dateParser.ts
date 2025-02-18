import { format, startOfToday, addDays, startOfWeek, addWeeks, endOfWeek, startOfMonth, addMonths, endOfMonth, parse, isValid } from 'date-fns';

export const convertDateString = (dateString: string): object => {

    const parsedDate1 = parse(dateString, 'dd/MM/yyyy', new Date());
    if (isValid(parsedDate1))
        return {
            startDate: format(parsedDate1, 'dd/MM/yyyy'),
            endDate: format(parsedDate1, 'dd/MM/yyyy'),
        }
    const parsedDate2 = parse(dateString, 'yyyy-MM-dd', new Date());
    if (isValid(parsedDate2))
        return {
            startDate: format(parsedDate2, 'dd/MM/yyyy'),
            endDate: format(parsedDate2, 'dd/MM/yyyy'),
        }

    dateString = dateString.replace("this ", "");
    const today = startOfToday();
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    const options = { weekStartsOn: 1 }; // Monday is the first day of the week

    const match = dateString.match(/(?:\+|\bin\b|\bfrom\b\s\bnow\b)?\s*(\d+)\s*(days?|weeks?|months?|weekends?)/i);
    if (match) {
        const number = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();

        switch (unit) {
            case 'day':
            case 'days':
                startDate = addDays(today, number);
                endDate = startDate;
                break;
            case 'week':
            case 'weeks':
                startDate = startOfWeek(addWeeks(today, number), options);
                endDate = endOfWeek(addWeeks(today, number), options);
                break;
            case 'month':
            case 'months':
                startDate = startOfMonth(addMonths(today, number));
                endDate = endOfMonth(addMonths(today, number));
                break;
            case 'weekend':
            case 'weekends':
                startDate = addDays(startOfWeek(addWeeks(today, number), options), 5); // Assuming weekend starts on Saturday
                endDate = addDays(startDate, 1);
                break;
            default:
                throw new Error(`Unknown unit: ${unit}`);
        }
    } else {

        const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayMatch = daysOfWeek.find(day => day === dateString.toLowerCase());

        if (dayMatch) {
            const todayIndex = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
            const targetIndex = daysOfWeek.indexOf(dayMatch);

            const diff = (targetIndex - todayIndex + 7) % 7;
            startDate = addDays(today, diff);
            endDate = startDate;
        } else {
        switch (dateString.toLowerCase()) {
            case 'today':
                startDate = today;
                endDate = today;
                break;
            case 'tomorrow':
                startDate = addDays(today, 1);
                endDate = addDays(today, 1);
                break;
            case 'day after tomorrow' || 'in 2 days' || 'tomorrow+1' || 'after-tomorrow' || 'after tomorrow' || 'Tomorrow + 1 day' || 'Tomorrow + 1':
                startDate = addDays(today, 2);
                endDate = addDays(today, 2);
                break;
            case 'this week' || 'current week':
                startDate = startOfWeek(today, options);
                endDate = endOfWeek(today, options);
                break;
            case 'next week':
                startDate = startOfWeek(addWeeks(today, 1), options);
                endDate = endOfWeek(addWeeks(today, 1), options);
                break;
            case 'this weekend':
                startDate = addDays(startOfWeek(today, options), 5);
                endDate = addDays(startDate, 1);
                break;
            case 'next weekend':
                startDate = addDays(startOfWeek(addWeeks(today, 1), options), 5);
                endDate = addDays(startDate, 1);
                break;
            case 'end of the week':
                startDate = addDays(startOfWeek(today, options), 4);
                endDate = addDays(startDate, 2);
                break;
            case 'beginning of the week':
                startDate = startOfWeek(today, options);
                endDate = addDays(startDate, 1);
                break;
            case 'middle of the week':
                startDate = addDays(startOfWeek(today, options), 2);
                endDate = addDays(startDate, 1);
                break;
            case 'this month':
                startDate = startOfMonth(today);
                endDate = endOfMonth(today);
                break;
            case 'next month':
                startDate = startOfMonth(addMonths(today, 1));
                endDate = endOfMonth(addMonths(today, 1));
                break;
            default:
                startDate = null;
                endDate = null;
                break;
        }
        }
    }

    return {
        startDate: startDate ? format(startDate, 'dd/MM/yyyy') : "",
        endDate: endDate ? format(endDate, 'dd/MM/yyyy') : "",
    }
}
