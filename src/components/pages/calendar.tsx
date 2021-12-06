import * as React from "react";
import FullCalendar, {
  EventInput,
  EventContentArg,
  EventClickArg,
} from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import { Title, Loader } from "@reapit/elements";
import { useGetAppointments } from "../../hooks/apiHooks";
import { AppointmentModel } from "@reapit/foundations-ts-definitions";
import timeGridPlugin from "@fullcalendar/timegrid";

interface Props {}

const Calendar = (props: Props) => {
  const appointments = useGetAppointments();
  const { status, data, error } = appointments;
  const [events, setEvents] = React.useState<EventInput[]>([]);

  React.useEffect(() => {
    if (status === "success" && data?._embedded) {
      const newEvents = data._embedded
        .filter((d: AppointmentModel) => {
          if (d.attendee?.contacts && d.attendee.contacts.length > 0)
            return true;
          return false;
        })
        .map((d) => {
          return {
            title: `Meeting with ${d.attendee?.contacts![0].name}`,
            date: new Date(),
          };
        });
      setEvents(newEvents);
    }
  }, [status, data]);

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (
      // eslint-disable-next-line
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  };

  return (
    <div>
      <Title>Calendar</Title>
      {status === "loading" ? (
        <Loader label="Loading" />
      ) : status === "error" ? (
        <p>Error getting Appointments detail: {error?.message}</p>
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          dateClick={(arg) => console.log(arg)}
          initialView="dayGridMonth"
          weekends={true}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          events={events}
          eventClick={handleEventClick}
        />
      )}
    </div>
  );
};

export default Calendar;
