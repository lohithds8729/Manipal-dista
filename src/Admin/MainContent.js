import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import relayService from "./AppProviders/Axios/hook";
import { Line } from "react-chartjs-2";
import ReactApexChart from 'react-apexcharts';
import { useNavigate } from 'react-router-dom';
import "./Main.css";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MainContent = () => {
  const [cdr, setCdr] = useState([]);
  const [success, setSuccess] = useState([]);
  const [failure, setFailure] = useState([]);
  const [startDate1, setStartDate1] = useState(new Date());
  const [endDate1, setEndDate1] = useState(new Date());
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [apexChartData, setApexChartData] = useState({
    series: [],
    options: {},
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [startDate1, endDate1]);

  const fetchData = async () => {
    try {
      const cdrResponse = await relayService({
        url: `/dista/fetchcdrdata?startDate=${formattedDate(startDate1)}&endDate=${formattedDate(endDate1)}`,
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const syncSuccessResponse = await relayService({
        url: `/dista/fetchapilogs/success?startDate=${formattedDate(startDate1)}&endDate=${formattedDate(endDate1)}`,
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const syncFailureResponse = await relayService({
        url: `/dista/fetchapilogs/failure?startDate=${formattedDate(startDate1)}&endDate=${formattedDate(endDate1)}`,
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      const cdrData = cdrResponse.data.data;
      const syncSuccessData = syncSuccessResponse.data.data;
      const syncFailureData = syncFailureResponse.data.data;
      const cdrcount = cdrResponse.data.count;
      const successcount = syncSuccessResponse.data.count;
      const failurecount = syncFailureResponse.data.count;

      setData(cdrData); // Assuming the main data list is from CDR
      setFilteredData(cdrData); // Filtering data accordingly
      setCdr(cdrcount);
      setSuccess(successcount);
      setFailure(failurecount)
      updateChartData(cdrData, syncSuccessData, syncFailureData);
      updateApexChartData(cdrData, syncSuccessData, syncFailureData);

    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const formattedDate = (date) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const updateChartData = (cdrData, syncSuccessData, syncFailureData) => {
    const groupByMonth = (data) => {
      return data.reduce((acc, item) => {
        const month = new Date(item.callDate || item.timestamp || item.createdDate).getMonth();
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});
    };

    const cdrGroupedData = groupByMonth(cdrData);
    const syncSuccessGroupedData = groupByMonth(syncSuccessData);
    const syncFailureGroupedData = groupByMonth(syncFailureData);

    const labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const cdrDataByMonth = labels.map((_, index) => cdrGroupedData[index] || 0);
    const syncSuccessDataByMonth = labels.map((_, index) => syncSuccessGroupedData[index] || 0);
    const syncFailureDataByMonth = labels.map((_, index) => syncFailureGroupedData[index] || 0);

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'CDR',
          data: cdrDataByMonth,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        },
        {
          label: 'Sync Success',
          data: syncSuccessDataByMonth,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
        },
        {
          label: 'Sync Failure',
          data: syncFailureDataByMonth,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
        }
      ]
    });
  };

  const updateApexChartData = (cdrData, syncSuccessData, syncFailureData) => {
    const groupByMonth = (data) => {
      return data.reduce((acc, item) => {
        const month = new Date(item.callDate || item.timestamp || item.createdDate).getMonth();
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});
    };

    const cdrGroupedData = groupByMonth(cdrData);
    const syncSuccessGroupedData = groupByMonth(syncSuccessData);
    const syncFailureGroupedData = groupByMonth(syncFailureData);

    const labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const cdrDataByMonth = labels.map((_, index) => cdrGroupedData[index] || 0);
    const syncSuccessDataByMonth = labels.map((_, index) => syncSuccessGroupedData[index] || 0);
    const syncFailureDataByMonth = labels.map((_, index) => syncFailureGroupedData[index] || 0);

    setApexChartData({
      series: [
        {
          name: 'CDR',
          data: cdrDataByMonth
        },
        {
          name: 'Sync Success',
          data: syncSuccessDataByMonth
        },
        {
          name: 'Sync Failure',
          data: syncFailureDataByMonth
        }
      ],
      options: {
        chart: {
          type: 'line',
          height: 350,
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        title: {
          text: 'Monthly Data',
          align: 'left'
        },
        xaxis: {
          categories: labels,
        },
        yaxis: {
          title: {
            text: 'Count'
          }
        },
        legend: {
          position: 'top'
        }
      }
    });
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setFilteredData(data.filter((item) => item.ctype.toLowerCase().includes(event.target.value.toLowerCase())));
  };

  const navigateToTab = (path) => {
    navigate(path);
  };

  return (
    <main id="main" className="main">
      <Container fluid className="small-font">
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <h1 className="font-weight-bold" style={{ fontSize: "16px" }}>Dashboard</h1>
        </div>

        <section className="section dashboard">
          <Row>
            <Row className="mb-4">
              <Col>
                <Form>
                  <Row className="justify-content-center align-items-center">
                    <Col xs="auto">
                      <Form.Label className="mr-sm-2 small-font label-spacing">Start Date</Form.Label>
                      <DatePicker selected={startDate1} onChange={date => setStartDate1(date)} className="form-control form-control-sm" />
                    </Col>
                    <Col xs="auto">
                      <Form.Label className="mr-sm-2 small-font label-spacing">End Date</Form.Label>
                      <DatePicker selected={endDate1} onChange={date => setEndDate1(date)} className="form-control form-control-sm" />
                    </Col>
                    <Col xs="auto">
                      <Button variant="primary" onClick={fetchData} style={{ fontSize: "10px" }}>Fetch Data</Button>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>

            <Col xl={4} md={6}>
              <Card className="info-card success-card">
                <Card.Body onClick={() => navigateToTab('/syncsuccessrecord')} style={{ backgroundColor: '#5E55B1' }}>
                  <Card.Title style={{ fontSize: '15px', color: 'white' }}>Sync Success</Card.Title>
                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                    <div className="ps-3">
                      <h6 style={{ color: 'white' }}>{success}</h6>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xl={4} md={6}>
              <Card className="info-card cdr-card">
                <Card.Body onClick={() => navigateToTab('/cdrsfetched')} style={{ backgroundColor: '#4154f1' }}>
                  <Card.Title style={{ fontSize: '15px', color: 'white' }}>CDR</Card.Title>
                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bi bi-telephone"></i>
                    </div>
                    <div className="ps-3">
                      <h6 style={{ color: 'white' }}>{cdr}</h6>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xl={4} md={6}>
              <Card className="info-card failure-card">
                <Card.Body onClick={() => navigateToTab('/syncfailurerecord')} style={{ backgroundColor: '#FF5B5B' }}>
                  <Card.Title style={{ fontSize: '15px', color: 'white' }}>Sync Failure</Card.Title>
                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    </div>
                    <div className="ps-3">
                      <h6 style={{ color: 'white' }}>{failure}</h6>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        <section>
          <div className="col-12">
            <Card className="recent-sales overflow-auto">
              <Card.Body>
                <Card.Title>Month-wise Data Chart</Card.Title>
                <div className="chart-container">
                  <Line
                    data={chartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: ''
                        },
                      },
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </div>
        </section>

        <section>
          <div className="col-12">
            <Card className="recent-sales overflow-auto">
              <Card.Body>
                <Card.Title>Monthly Data (ApexCharts)</Card.Title>
                <ReactApexChart options={apexChartData.options} series={apexChartData.series} type="line" height={350} />
              </Card.Body>
            </Card>
          </div>
        </section>
      </Container>
    </main>
  );
};

export default MainContent;
