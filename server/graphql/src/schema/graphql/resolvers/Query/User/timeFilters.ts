import {SlotProps} from "../../../../../types/types";
import moment from "moment-timezone";

export const filterSlotsByWorkingHours = (slots: SlotProps[], workStart: string, workEnd: string) => {
    return slots.reduce((filteredSlots, slot) => {
        const slotStart = moment(slot?.start);
        const slotEnd = moment(slot?.end);
        // console.log('[[slotStart]]', slotStart)
        // console.log('[[slotEnd]]', slotEnd)

        // Work start and end times in the context of each day
        const workStartTime = slotStart.clone().set({
            hour: moment(workStart, 'HH:mm:ss').hour(),
            minute: moment(workStart, 'HH:mm:ss').minute(),
            second: moment(workStart, 'HH:mm:ss').second(),
        });

        const workEndTime = slotStart.clone().set({
            hour: moment(workEnd, 'HH:mm:ss').hour(),
            minute: moment(workEnd, 'HH:mm:ss').minute(),
            second: moment(workEnd, 'HH:mm:ss').second(),
        });

        // Adjust slot start and end times to fit within work hours
        const adjustedStart = slotStart.isBefore(workStartTime) ? workStartTime : slotStart;
        const adjustedEnd = slotEnd.isAfter(workEndTime) ? workEndTime : slotEnd;

        if (adjustedStart.isBefore(adjustedEnd)) {
            filteredSlots.push({
                start: adjustedStart.toISOString(),
                end: adjustedEnd.toISOString(),
                duration: moment.duration(adjustedEnd.diff(adjustedStart)).asMinutes(),
            });
        }

        // If the slot extends past the end of the work day, add the next day's slot
        if (slotEnd.isAfter(workEndTime)) {
            let currentSlotStart = workStartTime.clone().add(1, 'day').startOf('day').set({
                hour: moment(workStart, 'HH:mm:ss').hour(),
                minute: moment(workStart, 'HH:mm:ss').minute(),
                second: moment(workStart, 'HH:mm:ss').second(),
            });

            while (currentSlotStart.isBefore(slotEnd)) {
                const currentSlotEnd = currentSlotStart.clone().set({
                    hour: moment(workEnd, 'HH:mm:ss').hour(),
                    minute: moment(workEnd, 'HH:mm:ss').minute(),
                    second: moment(workEnd, 'HH:mm:ss').second(),
                });

                if (currentSlotEnd.isAfter(slotEnd)) {
                    filteredSlots.push({
                        start: currentSlotStart.toISOString(),
                        end: slotEnd.toISOString(),
                        duration: moment.duration(slotEnd.diff(currentSlotStart)).asMinutes(),
                    });
                } else {
                    filteredSlots.push({
                        start: currentSlotStart.toISOString(),
                        end: currentSlotEnd.toISOString(),
                        duration: moment.duration(currentSlotEnd.diff(currentSlotStart)).asMinutes(),
                    });
                }

                currentSlotStart = currentSlotStart.add(1, 'day').startOf('day').set({
                    hour: moment(workStart, 'HH:mm:ss').hour(),
                    minute: moment(workStart, 'HH:mm:ss').minute(),
                    second: moment(workStart, 'HH:mm:ss').second(),
                });
            }
        }

        return filteredSlots;
    }, []);
};