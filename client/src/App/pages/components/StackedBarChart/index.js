import React, { Component } from 'react';
import * as d3 from 'd3';
import './index.css';

class StackedBarChart extends Component {
  componentDidMount() {
    this.drawChart();
  }

  componentDidUpdate(prevProps) {
    const { data, id } = this.props;
    if (prevProps.data !== data) {
      d3.select(`#${id}`)
        .selectAll('svg')
        .remove();
      this.drawChart();
    }
  }

  drawChart() {
    const { id, data } = this.props;

    const width = 400;
    const height = data.length * 40;

    const margin = {
      top: 20,
      right: 60,
      bottom: 30,
      left: 120
    };

    const svg = d3
      .select(`#${id}`)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const y = d3
      .scaleBand()
      .rangeRound([0, height])
      .padding(0.1)
      .align(0.1);

    const x = d3.scaleLinear().rangeRound([width, 0]);

    const z = d3.scaleOrdinal().range(['#833', '#235']);

    const stack = d3.stack().offset(d3.stackOffsetExpand);

    y.domain(data.map(d => d.realm));
    z.domain(['alliance', 'horde']);

    const serie = g
      .selectAll('.serie')
      .data(stack.keys(['alliance', 'horde'])(data))
      .enter()
      .append('g')
      .attr('class', 'serie')
      .attr('fill', d => z(d.key));

    const bar = serie
      .selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('y', d => y(d.data.realm))
      .attr('x', d => x(d[1]))
      .attr('width', d => x(d[0]) - x(d[1]))
      .attr('height', y.bandwidth());

    bar
      .append('text')
      .attr('x', d => x(d[1]))
      .attr('dy', '1.35em')
      .text(d => d);

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y));

    serie
      .append('g')
      .attr('class', 'legend')
      .attr(
        'transform',
        d => `translate(${(x(d[0][0]) + x(d[0][1])) / 2}, ${y(d[0].data.State) - y.bandwidth()})`
      );
  }

  render() {
    const { id } = this.props;
    return <div id={id} />;
  }
}

export default StackedBarChart;
