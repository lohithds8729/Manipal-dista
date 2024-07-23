import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Container, Row, Col, OverlayTrigger, Tooltip, Pagination, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import relayService from "../../AppProviders/Axios/hook";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../../Main.css";

const CDRsFetched = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filteredData, setFilteredData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    fetchData(startDate, endDate);
  }, [startDate, endDate]);

  const fetchData = async (startDate, endDate) => {
    try {
      setLoading(true);

      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);

      const response = await relayService({
        url: `/dista/fetchcdrdata?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      setFilteredData(response.data.data);
      setTotalCount(response.data.count);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching data", err);
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleCopy = () => {
    const table = document.querySelector("table");
    const range = new Range();
    range.selectNode(table);
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(range);
    document.execCommand("copy");
    document.getSelection().removeAllRanges();
  };

  const handleCSV = () => {
    const table = document.querySelector("table");
    let csvContent = Array.from(table.querySelectorAll("tr"), (row) =>
      Array.from(row.querySelectorAll("td, th"), (cell) => `"${cell.textContent.replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: "table_data.csv",
    });
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      Array.from(document.querySelectorAll("table th")).map(th => th.textContent),
      ...Array.from(document.querySelectorAll("table tbody tr")).map(tr => Array.from(tr.querySelectorAll("td")).map(td => td.textContent)),
    ]);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "table_data.xlsx");
  };

  const handlePDF = () => {
    const dataTable = document.querySelector("table");
    if (!dataTable) {
      console.error("DataTable not found");
      return;
    }
    html2canvas(dataTable, { backgroundColor: "#FFFFFF" }).then((canvas) => {
      const pdf = new jsPDF("p", "px", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const aspectRatio = imgWidth / imgHeight;
      let pdfImgWidth = pdfWidth;
      let pdfImgHeight = pdfWidth / aspectRatio;
      if (pdfImgHeight > pdfHeight) {
        pdfImgHeight = pdfHeight;
        pdfImgWidth = pdfHeight * aspectRatio;
      }

      pdf.setFillColor("#FFFFFF");
      pdf.rect(0, 0, pdfWidth, 40, "F");

      pdf.setTextColor("#000");
      pdf.setFontSize(14);
      const yOffset = 20;
      pdf.addImage(canvas, "PNG", 0, yOffset + 20, pdfImgWidth, pdfImgHeight);
      pdf.save("datatable_data_dark.pdf");
    });
  };

  const handlePrint = () => {
    const dataTable = document.querySelector("table");
    const printWindow = window.open("", "_blank");

    const printContent = `
        <html>
            <head>
                <style>
                    table {
                        font-size: 14px; /* Adjust font size as needed */
                        border-collapse: collapse;
                        width: 100%;
                    }
                    th, td {
                        text-align: left;
                        padding: 8px;
                        border-bottom: 1px solid #ddd;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body style="font-size: 16px; padding: 20px;"> <!-- Adjust body font size and padding as needed -->
                ${dataTable.outerHTML}
            </body>
        </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset pagination to first page on search
  };

  // const handleSort = (key) => {
  //   let direction = 'ascending';
  //   if (sortConfig.key === key && sortConfig.direction === 'ascending') {
  //     direction = 'descending';
  //   }
  //   setSortConfig({ key, direction });

  //   const sortedData = [...filteredData].sort((a, b) => {
  //     if (direction === 'ascending') {
  //       return a[key] < b[key] ? -1 : 1;
  //     } else {
  //       return a[key] > b[key] ? -1 : 1;
  //     }
  //   });
  //   setFilteredData(sortedData);
  // };

  // const getSortIcon = (key) => {
  //   if (sortConfig.key === key) {
  //     return sortConfig.direction === 'ascending' ? <i className="bi bi-arrow-up"></i> : <i className="bi bi-arrow-down"></i>;
  //   }
  //   // Default icon to show when not sorted
  //   return <i className="bi bi-arrow-up-down"></i>;
  // };


  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const SortIcon = ({ direction }) => {
    if (direction === 'asc') return <span>▲</span>;
    if (direction === 'desc') return <span>▼</span>;
    return <span>⇅</span>;
  };
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredData].sort((a, b) => {
      if (direction === 'ascending') {
        return a[key] < b[key] ? -1 : 1;
      } else {
        return a[key] > b[key] ? -1 : 1;
      }
    });
    setFilteredData(sortedData);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return <SortIcon direction={sortConfig.direction} />;
    }
    return <SortIcon />;
  };
  return (
    <Container className='small-font'>
      <Card className="mt-2 p-3">
        <h4 className="small-fontsize" style={{ borderBottom: "1px solid #ddd", display: "flex", justifyContent: "space-between" }}>
          <span>CDR Table</span>
          <span>Total Count: {totalCount}</span>
        </h4>
        <Row className="mb-3 mt-3 align-items-center">
          <Col className='button-group'>
            <Col xs="auto">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="copy-tooltip">Copy</Tooltip>}
              >
                <Button
                  className=""
                  style={{ fontSize: '12px', backgroundColor: '#a6461e', borderColor: '#a6461e', color: 'white' }}
                  onClick={handleCopy}
                >
                  Copy
                </Button>
              </OverlayTrigger>
            </Col>

            <Col xs="auto">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="csv-tooltip">CSV</Tooltip>}
              >
                <Button className="" style={{ fontSize: '12px' }} onClick={handleCSV}>
                  CSV
                </Button>
              </OverlayTrigger>
            </Col>
            <Col xs="auto">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="excel-tooltip">Excel</Tooltip>}
              >
                <Button className="" style={{ fontSize: '12px'}} onClick={handleExcel}>
                  Excel
                </Button>
              </OverlayTrigger>
            </Col>
            <Col xs="auto">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="pdf-tooltip">PDF</Tooltip>}
              >
                <Button className="" style={{ fontSize: '12px', backgroundColor: '#a6461e', borderColor: '#a6461e', color: 'white' }}
                  onClick={handlePDF}>
                  PDF
                </Button>
              </OverlayTrigger>
            </Col>
            <Col xs="auto">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="print-tooltip">Print</Tooltip>}
              >
                <Button className="" style={{ fontSize: '12px', backgroundColor: '#a6461e', borderColor: '#a6461e', color: 'white' }}
                  onClick={handlePrint}>
                  Print
                </Button>
              </OverlayTrigger>
            </Col>
          </Col>
          <Col className='d-flex justify-content-end'>
            <Col xs="auto">
              <Form.Label className="mr-sm-2 label-spacing">Start Date</Form.Label>
              <DatePicker selected={startDate} onChange={date => setStartDate(date)} className="small-font label-spacing" />
            </Col>
            <Col xs="auto">
              <Form.Label className="mr-sm-2 label-spacing">End Date</Form.Label>
              <DatePicker selected={endDate} onChange={date => setEndDate(date)} className="small-font" />
            </Col>
          </Col>
        </Row>

        {/* Search */}
        <Row>
          <Col className='d-flex justify-content-end'>
            <Form.Control
              type="text"
              placeholder="Search..."
              className="mb-3"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ width: "100%", maxWidth: "300px", fontSize: "12px" }}
            />
          </Col>
        </Row>

        {/* Scrollable Table */}
        <div className="scrollable-table-container">
          <Table striped bordered hover className="table-bordered small-font" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th onClick={() => handleSort('aid')}>
                  Agent ID {getSortIcon('aid')}
                </th>
                <th onClick={() => handleSort('cid')}>
                  CID {getSortIcon('cid')}
                </th>
                <th onClick={() => handleSort('attempts')}>
                  Attempts {getSortIcon('attempts')}
                </th>
                <th onClick={() => handleSort('callid')}>
                  Caller ID {getSortIcon('callid')}
                </th>
                <th onClick={() => handleSort('ctype')}>
                  Call Type {getSortIcon('ctype')}
                </th>
                <th onClick={() => handleSort('campaign')}>
                  Campaign Name {getSortIcon('campaign')}
                </th>
                <th onClick={() => handleSort('startTime')}>
                  Start Time {getSortIcon('startTime')}
                </th>
                <th onClick={() => handleSort('endTime')}>
                  End Time {getSortIcon('endTime')}
                </th>
                <th onClick={() => handleSort('duration')}>
                  Duration {getSortIcon('duration')}
                </th>
                <th onClick={() => handleSort('callDate')}>
                  Call Date {getSortIcon('callDate')}
                </th>
                <th onClick={() => handleSort('source')}>
                  Source {getSortIcon('source')}
                </th>
                <th onClick={() => handleSort('status')}>
                  Status {getSortIcon('status')}
                </th>
                <th onClick={() => handleSort('talkTime')}>
                  Talk Time {getSortIcon('talkTime')}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems
                .filter(item => searchTerm === '' ||
                  item.aid.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.cid.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.callid.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.ctype.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.talkTime.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{item.aid}</td>
                    <td className="text-center">{item.cid}</td>
                    <td className="text-center">{item.attempts}</td>
                    <td className="text-center">{item.callid}</td>
                    <td className="text-center">{item.ctype}</td>
                    <td className="text-center">{item.campaign}</td>
                    <td className="text-center">{item.startTime}</td>
                    <td className="text-center">{item.endTime}</td>
                    <td className="text-center">{item.duration}</td>
                    <td className="text-center">{item.callDate}</td>
                    <td className="text-center">{item.source}</td>
                    <td className="text-center">{item.status}</td>
                    <td className="text-center">{item.talkTime}</td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr>
                <th onClick={() => handleSort('aid')}>
                  Agent ID {getSortIcon('aid')}
                </th>
                <th onClick={() => handleSort('cid')}>
                  CID {getSortIcon('cid')}
                </th>
                <th onClick={() => handleSort('attempts')}>
                  Attempts {getSortIcon('attempts')}
                </th>
                <th onClick={() => handleSort('callid')}>
                  Caller ID {getSortIcon('callid')}
                </th>
                <th onClick={() => handleSort('ctype')}>
                  Call Type {getSortIcon('ctype')}
                </th>
                <th onClick={() => handleSort('campaign')}>
                  Campaign Name {getSortIcon('campaign')}
                </th>
                <th onClick={() => handleSort('startTime')}>
                  Start Time {getSortIcon('startTime')}
                </th>
                <th onClick={() => handleSort('endTime')}>
                  End Time {getSortIcon('endTime')}
                </th>
                <th onClick={() => handleSort('duration')}>
                  Duration {getSortIcon('duration')}
                </th>
                <th onClick={() => handleSort('callDate')}>
                  Call Date {getSortIcon('callDate')}
                </th>
                <th onClick={() => handleSort('source')}>
                  Source {getSortIcon('source')}
                </th>
                <th onClick={() => handleSort('status')}>
                  Status {getSortIcon('status')}
                </th>
                <th onClick={() => handleSort('talkTime')}>
                  Talk Time {getSortIcon('talkTime')}
                </th>
              </tr>
            </tfoot>
          </Table>
        </div>

        {/* Pagination */}
        <Row className="justify-content-between mt-3">
          <Col xs="auto">
            <div className="pagination-info">
              Showing {currentItems.length} of {totalCount} entries
            </div>
          </Col>
          <Col xs="auto">
            <Pagination>
              <Pagination.Prev
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
              />
            </Pagination>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default CDRsFetched;

