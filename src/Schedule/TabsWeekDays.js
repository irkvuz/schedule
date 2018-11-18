import React from 'react';
import { Tabs, Table, Icon, Switch } from 'antd';
import moment from 'moment';
import './TabsWeekDays.css';

const TabPane = Tabs.TabPane;

const wdn = 'Воскресенье_Понедельник_Вторник_Среда_Четверг_Пятница_Суббота'.split(
  '_'
);

const LessonTypes = {
  вне: { name: 'внеучебное занятие', className: 'lek0' },
  л: { name: 'лекция', className: 'lek1' },
  пр: { name: 'практическое занятие', className: 'lek2' },
  лаб: { name: 'лабораторная работа', className: 'lek3' },
  зач: { name: 'зачет', className: 'lek4' },
  экз: { name: 'экзамен', className: 'lek5' },
  конс: { name: 'консультация', className: 'lek6' },
  'п/с': { name: 'пересдача', className: 'lek7' },
  '': { name: 'внеплановое занятие', className: 'lek8' },
  тест: { name: 'тестирование', className: 'lek9' },
  подг: { name: 'подготовительные курсы', className: 'lek10' },
  ол: { name: 'олимпиада', className: 'lek11' },
  конф: { name: 'научная конференция', className: 'lek12' },
  откр: { name: 'день открытых дверей', className: 'lek13' },
};

const columns = [
  {
    key: 'first',
    className: 'StartTime_Room',
    render: (text, record, index) => {
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
    render: (text, record, index) => {
      return (
        <>
          <div>
            <span
              title={LessonTypes[record.LessonType].name}
              className={`LessonType ${
                LessonTypes[record.LessonType].className
              }`}
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

class TabsWeekDays extends React.Component {
  constructor(props) {
    super(props);
    let today = moment();
    this.state = {
      mode: 'top',
      parity: props.week_number % 2 === 0,
      day: today.isoWeekday(),
      today,
    };
  }

  updateDimensions = () => {
    this.setState({
      mode: window.innerWidth > window.innerHeight ? 'left' : 'top',
    });
  };
  componentWillMount = function() {
    this.updateDimensions();
  };
  componentDidMount = function() {
    window.addEventListener('resize', this.updateDimensions);
  };
  componentWillUnmount = function() {
    window.removeEventListener('resize', this.updateDimensions);
  };

  handleParityChange = parity => {
    this.setState({ parity });
  };

  render() {
    console.log('Component TabsWeekDays props =', this.props);
    let weekdays = [];
    for (let i = 1; i <= 6; i++) {
      weekdays[i] = {
        name: wdn[i],
        lessons: [],
      };
    }
    const { schedule } = this.props;
    for (let s of schedule) {
      if (
        s.Odd === 0 ||
        (this.state.parity && s.Odd === 2) ||
        (!this.state.parity && s.Odd === 1)
      )
        weekdays[s.WeekDay].lessons.push(s);
    }
    const tabpanes = weekdays.map((wd, i) => {
      if (wd.lessons.length > 0)
        return (
          <TabPane tab={wd.name} key={i}>
            <Table
              dataSource={wd.lessons}
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
          Сегодня {wdn[this.state.day % 7]}, {this.state.today.format('LL')}{' '}
          неделя {this.props.week_number} из {this.props.week_total} (
          {this.props.week_number % 2 === 0 ? 'Четная' : 'Нечетная'})
        </div>
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
          defaultActiveKey={this.state.day.toString()}
          tabPosition={this.state.mode}
        >
          {tabpanes}
        </Tabs>
      </>
    );
  }
}

export default TabsWeekDays;
