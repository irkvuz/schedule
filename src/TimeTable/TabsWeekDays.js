import React from 'react';
import { Tabs, Radio, Table } from 'antd';
import './TabsWeekDays.css';

const TabPane = Tabs.TabPane;

const columns = [
  {
    title: 'Время',
    dataIndex: 'StartTime',
  },
  {
    title: 'Предмет',
    dataIndex: 'Lesson',
  },
  {
    title: 'Преподаватель',
    dataIndex: 'FIO',
  },
  {
    title: 'Кабинет',
    dataIndex: 'Room',
  },
];

class TabsWeekDays extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'top',
    };
  }

  handleModeChange = e => {
    const mode = e.target.value;
    this.setState({ mode });
  };

  render() {
    const { mode } = this.state;
    return (
      <div>
        <Radio.Group
          onChange={this.handleModeChange}
          value={mode}
          style={{ marginBottom: 8 }}
        >
          <Radio.Button value="top">Horizontal</Radio.Button>
          <Radio.Button value="left">Vertical</Radio.Button>
        </Radio.Group>
        <Tabs defaultActiveKey="1" tabPosition={mode}>
          <TabPane tab="Понедельник" key="1">
            <Table
              dataSource={this.props.schedule}
              columns={columns}
              size="small"
              scroll={{ x: true }}
            />
          </TabPane>
          <TabPane tab="Вторник" key="2" />
          <TabPane tab="Среда" key="3" />
          <TabPane tab="Четверг" key="4" />
          <TabPane tab="Пятница" key="5" />
          <TabPane tab="Суббота" key="6" />
        </Tabs>
      </div>
    );
  }
}

export default TabsWeekDays;
