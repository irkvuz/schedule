import React from 'react';
import { Tabs, Table, Icon, Switch, Alert, message, Spin } from 'antd';
import { TabsPosition } from 'antd/lib/tabs';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import './TabsWeekDays.css';

const TabPane = Tabs.TabPane;

/** WeekDayNames - названия дней недели */
const wdn = 'Воскресенье_Понедельник_Вторник_Среда_Четверг_Пятница_Суббота_Воскресенье'.split(
  '_'
);

interface ILessonType {
  shortName: string;
  fullName: string;
  className: string;
}

const LessonTypes: ILessonType[] = [
  { shortName: 'вне', fullName: 'внеучебное занятие', className: 'lek0' },
  { shortName: 'л', fullName: 'лекция', className: 'lek1' },
  { shortName: 'пр', fullName: 'практическое занятие', className: 'lek2' },
  { shortName: 'лаб', fullName: 'лабораторная работа', className: 'lek3' },
  { shortName: 'зач', fullName: 'зачет', className: 'lek4' },
  { shortName: 'экз', fullName: 'экзамен', className: 'lek5' },
  { shortName: 'конс', fullName: 'консультация', className: 'lek6' },
  { shortName: 'п/с', fullName: 'пересдача', className: 'lek7' },
  { shortName: '', fullName: 'внеплановое занятие', className: 'lek8' },
  { shortName: 'тест', fullName: 'тестирование', className: 'lek9' },
  { shortName: 'подг', fullName: 'подготовительные курсы', className: 'lek10' },
  { shortName: 'ол', fullName: 'олимпиада', className: 'lek11' },
  { shortName: 'конф', fullName: 'научная конференция', className: 'lek12' },
  { shortName: 'откр', fullName: 'день открытых дверей', className: 'lek13' },
];

export interface ILessonOld {
  WeekDay: number;
  StartTime: string;
  Odd: number;
  Lesson: string;
  LessonType: string;
  Room: string;
  FIO: string;
  FIOshort: string;
  Error: string | null;
}

const columns: ColumnProps<ILessonOld>[] = [
  {
    key: 'first',
    className: 'StartTime_Room',
    render: (text: any, record: ILessonOld, index: number) => {
      return (
        <React.Fragment>
          <div className="StartTime">
            <Icon type="clock-circle" /> {record.StartTime}
          </div>
          <div className="Room">
            <Icon type="environment" /> {record.Room}
          </div>
        </React.Fragment>
      );
    },
  },
  {
    key: 'second',
    render: (text: any, record: ILessonOld, index: number) => {
      const lessonType =
        LessonTypes.find(type => type.shortName === record.LessonType) ||
        LessonTypes[0];
      return (
        <>
          <div>
            <span
              title={lessonType.fullName}
              className={`LessonType ${lessonType.className}`}
            >
              {record.LessonType}
            </span>
            &nbsp;
            {record.Lesson}
          </div>
          <div title={record.FIO}>
            <Icon type="user" /> {record.FIO}
          </div>
        </>
      );
    },
  },
];

interface Props {
  loading: boolean;
  schedule: ILessonOld[];
  week_number: number;
  week_total: number;
}

interface State {
  tabPosition: TabsPosition;
  parity: boolean;
  today: moment.Moment;
  defaultActiveKey: string;
}

interface IWeekDay {
  name: string;
  lessons: ILessonOld[];
}

class TabsWeekDays extends React.Component<Props, State> {
  state: State = {
    tabPosition: 'top',
    parity: false,
    today: moment(),
    defaultActiveKey: '1',
  };
  // Initial counting schedule params
  init() {
    let parity = (this.props.week_number + 15) % 2 === 0;
    // Поиск ближайшего следующего дня для которого есть расписание
    let todayWeekday = this.state.today.isoWeekday();
    const schedule = this.props.schedule;
    // This may loks like a magic, but it's just found minimal weekday
    let minWeekday = schedule
      .map(v => v.WeekDay)
      .reduce((min, weekday, i) => {
        const lesson = schedule[i];
        if (lesson.Odd === 0 && weekday < todayWeekday) {
          // пара каждую неделю и на этой неделе этот день уже прошел
          // => пара будет на следующей
          weekday += 7;
        } else if (
          (lesson.Odd === 1 && parity) ||
          (lesson.Odd === 2 && !parity)
        ) {
          // пара не на этой неделе
          weekday += 7;
        } else if (weekday < todayWeekday) {
          // пара на этой неделе, но день уже прошел
          weekday += 14;
        }
        return Math.min(min, weekday);
      }, 15);

    // We need to correct minWeekday value a little bit
    if (minWeekday > 14) {
      minWeekday -= 14;
    } else if (minWeekday > 7) {
      // если пара в день на следующей неделе, надо поменять четность
      minWeekday -= 7;
      parity = !parity;
    }
    this.setState({
      parity,
      defaultActiveKey: String(minWeekday),
    });
  }

  updateDimensions = () => {
    this.setState({
      tabPosition: window.innerWidth > window.innerHeight ? 'left' : 'top',
    });
  };
  componentWillMount = () => {
    this.updateDimensions();
  };
  componentDidMount = () => {
    this.init();
    window.addEventListener('resize', this.updateDimensions);
  };
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateDimensions);
  };
  componentDidUpdate = (prevProps: Props, prevState: State) => {
    if (this.props.schedule !== prevProps.schedule) this.init();
  };

  handleParityChange = (parity: boolean) => {
    this.setState({ parity });
    message.info(`Показана ${parity ? 'четная' : 'нечетная'} неделя`, 1);
  };

  render() {
    // console.log('Component TabsWeekDays props =', this.props);
    let weekdays: IWeekDay[] = [];

    for (let i = 1; i <= 7; i++) {
      weekdays[i] = {
        name: wdn[i],
        lessons: [],
      };
    }

    const { schedule, loading } = this.props;

    if (loading) return <Spin />;

    if (!schedule || schedule.length <= 1)
      return <div>К сожалению, для этой группы нет расписания</div>;

    for (let s of schedule) {
      if (
        !s.Error &&
        (s.Odd === 0 ||
          (this.state.parity && s.Odd === 2) ||
          (!this.state.parity && s.Odd === 1))
      )
        weekdays[s.WeekDay].lessons.push(s);
    }

    const tabsContent = weekdays.map((weekday, i) => {
      if (weekday.lessons.length > 0)
        return (
          <TabPane tab={weekday.name} key={String(i)}>
            <Table
              dataSource={weekday.lessons}
              columns={columns}
              size="small"
              className="Schedule"
              showHeader={false}
              pagination={false}
              rowKey={r =>
                r.WeekDay +
                r.StartTime +
                r.Odd +
                r.Lesson +
                r.LessonType +
                r.FIO
              }
            />
          </TabPane>
        );
      else return null;
    });
    return (
      <>
        <div>
          Сегодня {wdn[this.state.today.isoWeekday() % 7]},{' '}
          {this.state.today.format('LL')}{' '}
          {/* @TODO I need to do something with weeks and semesters */}
          неделя в семестре {this.props.week_number} из {this.props.week_total},
          неделя в году {this.props.week_number + 15} из{' '}
          {this.props.week_total + 15} (
          {(this.props.week_number + 15) % 2 === 0 ? 'Четная' : 'Нечетная'})
        </div>
        {this.props.week_number > this.props.week_total && (
          <Alert
            type="warning"
            showIcon
            message="Учебный семестр закончился. Сейчас отображается расписание прошедшего семестра."
          />
        )}
        <div className="switch-parity">
          Показать неделю: &nbsp;
          <Switch
            checkedChildren="ч"
            unCheckedChildren="н"
            checked={this.state.parity}
            onChange={this.handleParityChange}
          />
        </div>
        <Tabs
          defaultActiveKey={this.state.defaultActiveKey}
          tabPosition={this.state.tabPosition}
          animated={false}
        >
          {tabsContent}
        </Tabs>
      </>
    );
  }
}

export default TabsWeekDays;
