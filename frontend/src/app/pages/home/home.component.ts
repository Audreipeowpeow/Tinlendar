import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { ChartComponent } from 'ng-apexcharts';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

export type Event = {
  name: string;
  description: string;
  hashtags: string[];
  image: string;
};

export type People = {
  name: string;
  school: string;
  avatar: string;
  location: string;
  hashtags: string[];
};

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      h3 {
        margin: 0 0 10px;
      }

      pre {
        background-color: #f5f5f5;
        padding: 15px;
      }
    `,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: ChartOptions = {
    series: [44, 55, 13, 43, 22],
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: ['Technology', 'Debate', 'MUN', 'Volunteer', 'Financial'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };
  @ViewChild('modalContent', { static: true }) modalContent:
    | TemplateRef<any>
    | undefined;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData:
    | {
        action: string;
        event: CalendarEvent;
      }
    | undefined;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

  filteredList: Event[] = [];

  eventList: Event[] = [
    {
      name: 'Shecodes Hackathon 2023',
      description:
        'The first annual technology peoduct development competition specificially for women in Vietnam',
      hashtags: ['Technology', 'Hackathon'],
      image:
        'https://scontent.fsgn8-3.fna.fbcdn.net/v/t39.30808-6/370476591_336501165397855_6862237442028680347_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=5f2048&_nc_ohc=82ycgJuYfFcAX-5Pfe8&_nc_ht=scontent.fsgn8-3.fna&oh=00_AfDTsvR5vADQXFfJbDeCvJFuKYsUQEj796cQO-55XkAIfg&oe=653030AD',
    },
    {
      name: 'Ho Chi Minh Debate Open 2023',
      description: 'An annual Asian Paliamentary debate tournament',
      hashtags: ['Debate', 'AP'],
      image:
        'https://scontent.fsgn8-3.fna.fbcdn.net/v/t39.30808-6/350955347_1414988399266067_8804947114888281171_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=YnOJeTrNFyEAX85AgZ0&_nc_ht=scontent.fsgn8-3.fna&oh=00_AfAD9p1bVDVjIsWzHzd8KxLPpfMVMu8ixbKlabF-t_8yWQ&oe=653076C1',
    },
  ];

  exploreList: Event[] = [
    {
      name: 'Marketing on air 2023',
      description:
        'A marketing competition that challenges participants to craft innovative marketing...',
      hashtags: ['Business', 'Marketing'],
      image:
        'https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/370586377_686676803497039_1719845890217820685_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=NeW2rBMsWnwAX9wLsAJ&_nc_ht=scontent.fsgn8-4.fna&oh=00_AfBeM35gYtWj6KOuLb_8iJpW5I8nydS40RiBk2mHfiVUhw&oe=652F9CFA',
    },
    {
      name: "Unilever Future Leader's League 2023",
      description:
        'A prestigious competition that brings together top young talents to develop sustainable business...',
      hashtags: ['Business', 'Leadership'],
      image:
        'https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/376721270_684665360363191_8966097388044999919_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_ohc=3P6WljvBOEUAX9yRwgm&_nc_ht=scontent.fsgn8-4.fna&oh=00_AfCymbRJ_UBiy2FxttgZDlBIwsOzvEkP9h-0qNYAJsE4YQ&oe=6530898A',
    },
    {
      name: 'Marketing Challengers Season 11',
      description:
        'A high-stakes competition where marketing enthusiasts and professionals compete to design...',
      hashtags: ['Marketing', 'CaseStudy'],
      image:
        'https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/309647894_5387713897961132_7516777564995673366_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=4rZtLG0Am1sAX_uVob5&_nc_ht=scontent.fsgn8-4.fna&oh=00_AfACKzaRnHApG5gKjmPKc0ibt14GlLR-5FY29ECaA3qnxw&oe=65302589',
    },
  ];

  achieveList: Event[] = [
    {
      name: 'Shecodes Hackathon 2023',
      description:
        'The first annual technology peoduct development competition specificially for women in Vietnam',
      hashtags: ['Technology', 'Hackathon'],
      image:
        'https://scontent.fsgn8-3.fna.fbcdn.net/v/t39.30808-6/370476591_336501165397855_6862237442028680347_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=5f2048&_nc_ohc=82ycgJuYfFcAX-5Pfe8&_nc_ht=scontent.fsgn8-3.fna&oh=00_AfDTsvR5vADQXFfJbDeCvJFuKYsUQEj796cQO-55XkAIfg&oe=653030AD',
    },
    {
      name: 'CODEGODA 2023',
      description:
        'A platform for aspiring programmers to showcase their coding skills and innovative problem-solving',
      hashtags: ['Technology', 'Coding'],
      image:
        'https://codegoda.io/wp-content/uploads/2023/02/Codegoda-2023-Unstop-1400x800-1.jpg',
    },
    {
      name: 'JunctionX Hanoi 2023',
      description:
        'An innovation competition where participants come together to develop creative solutions, leveraging...',
      hashtags: ['Technology', 'Hackathon'],
      image:
        'https://genk.mediacdn.vn/139269124445442048/2023/3/22/photo-1-16794563950221590765100-1679462327659-1679462328041521452772.png',
    },
  ];

  peopleList: People[] = [
    {
      name: 'Lan Nghi',
      school: 'UEH',
      avatar:
        'https://static.everypixel.com/ep-pixabay/0329/8099/0858/84037/3298099085884037069-head.png',
      location: 'Ho Chi Minh City',
      hashtags: ['Debate', 'Technology', 'Business'],
    },
    {
      name: 'Hoang Anh',
      school: 'NEU',
      avatar:
        'https://static.everypixel.com/ep-pixabay/0329/8099/0858/84037/3298099085884037069-head.png',
      location: 'Ha Noi',
      hashtags: ['AP', 'Business'],
    },
    {
      name: 'Minh Huy',
      school: 'FUV',
      avatar:
        'https://static.everypixel.com/ep-pixabay/0329/8099/0858/84037/3298099085884037069-head.png',
      location: 'Ho Chi Minh City',
      hashtags: ['Art', 'Volunteer'],
    },
  ];

  constructor(private modal: NgbModal) {
    this.filteredList = this.eventList;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors['red'],
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  filterResults(text: string) {
    if (!text) {
      this.filteredList = this.eventList;
    }

    this.filteredList = this.eventList.filter((event) =>
      event?.name.toLowerCase().includes(text.toLowerCase())
    );
  }
}
