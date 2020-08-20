import React, { Component, MouseEvent } from 'react';
const { ipcRenderer } = window.require('electron');
import { Compare } from './leftPanel/Compare';
import History from './leftPanel/History';
import { SchemaContainer } from './rightPanel/SchemaContainer';

type ClickEvent = React.MouseEvent<HTMLElement>;

type MainState = {
  queries: {
    queryString: string;
    queryData: object[];
    queryStatistics: any;
    querySchema: string;
  }[];
  currentSchema: string;
};

type MainProps = {};

class MainPanel extends Component<MainProps, MainState> {
  constructor(props: MainProps) {
    super(props);
  }

  state: MainState = {
    queries: [
      {
        queryString: 'SELECT * FROM public.items',
        queryData: [
          {
            _id: 1,
            title: 'fiddle leaf fig',
            description: 'lovely green addition to your home',
            image:
              'https://cdn.shopify.com/s/files/1/0013/3529/6118/products/Kent-48-3265.048-WH_Fiddle-Leaf-Fig-Tree-14.jpg?v=1590447682',
            category: 'home goods',
            status: false,
            user_id: '1',
            item_latitude: '37.4224764',
            item_longitude: '-122.0842499',
          },
          {
            _id: 2,
            title: 'monstera leaf',
            description: 'lovely green addition to your home',
            image:
              'https://cdn.shopify.com/s/files/1/0150/6262/products/the-sill_monstera_variant_medium_grant_cream_54108884-3d3d-44f4-9c34-d741345067ab_1200x.jpg?v=1589821773',
            category: 'home goods',
            status: false,
            user_id: '1',
            item_latitude: '37.4224764',
            item_longitude: '-122.0842499',
          },
        ],
        queryStatistics: {
          items: [
            {
              'QUERY PLAN': [
                {
                  Plan: {
                    'Node Type': 'Seq Scan',
                    'Parallel Aware': false,
                    'Relation Name': 'items',
                    Alias: 'items',
                    'Startup Cost': 0,
                    'Total Cost': 11.9,
                    'Plan Rows': 190,
                    'Plan Width': 391,
                    'Actual Startup Time': 0.014,
                    'Actual Total Time': 0.015,
                    'Actual Rows': 6,
                    'Actual Loops': 1,
                  },
                  'Planning Time': 0.262,
                  Triggers: [],
                  'Execution Time': 0.038,
                },
              ],
            },
          ],
        },
        querySchema: 'schemaA',
      },
      {
        queryString: 'SELECT * FROM public.users',
        queryData: [
          {
            _id: 1,
            email: 'cc2368@cornell.edu',
            firstName: 'Catherine',
            lastName: 'Chiu',
            password: 'helloworld',
            points: 500,
            address_id: '1',
          },
          {
            _id: 2,
            email: 'jm@gmail.com',
            firstName: 'John',
            lastName: 'Madrigal',
            password: 'helloworld',
            points: 500,
            address_id: '2',
          },
        ],
        queryStatistics: {
          items: [
            {
              'QUERY PLAN': [
                {
                  Plan: {
                    'Node Type': 'Seq Scan',
                    'Parallel Aware': false,
                    'Relation Name': 'users',
                    Alias: 'users',
                    'Startup Cost': 0,
                    'Total Cost': 12.3,
                    'Plan Rows': 230,
                    'Plan Width': 316,
                    'Actual Startup Time': 0.012,
                    'Actual Total Time': 0.013,
                    'Actual Rows': 15,
                    'Actual Loops': 1,
                  },
                  'Planning Time': 0.367,
                  Triggers: [],
                  'Execution Time': 0.034,
                },
              ],
            },
          ],
        },
        querySchema: 'schemaB',
      },
    ],
    currentSchema: 'schemaB',
  };

  render() {
    return (
      <div id="main-panel">
        <div id="main-left">
          <History queries={this.state.queries} currentSchema={this.state.currentSchema} />
          <Compare />
        </div>
        <SchemaContainer currentSchema={this.state.currentSchema} />
      </div>
    );
  }
}

export default MainPanel;
