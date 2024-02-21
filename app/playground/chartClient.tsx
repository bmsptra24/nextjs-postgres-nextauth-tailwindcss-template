'use client';
import React from 'react';
import { Card, AreaChart, Title, Text } from '@tremor/react';

interface TData {
  Month: string;
  Sales: number;
  Profit: number;
}
const ChartClient = ({ data }: { data: TData[] }) => {
  return (
    <Card className="mt-8">
      <Title>Performance</Title>
      <Text>Comparison between Sales and Profit</Text>
      <AreaChart
        className="mt-4 h-80"
        data={data}
        categories={['Sales', 'Profit']}
        index="Month"
        colors={['indigo', 'fuchsia']}
        valueFormatter={(number: number) =>
          `$ ${Intl.NumberFormat('us').format(number).toString()}`
        }
        yAxisWidth={60}
      />
    </Card>
  );
};

export default ChartClient;
