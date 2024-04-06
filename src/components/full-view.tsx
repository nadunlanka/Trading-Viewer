import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Grid,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tabs
} from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Loader from './spinner';
import { ToastContainer, toast } from 'react-toastify';

import { CategoryScale, Chart, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js';
import { ToastConfig, formatCurrency, formatNumber, removeDuplicates } from '../utils';
import { LOADING_ERROR } from '../const';
Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(PointElement);
Chart.register(LineElement);
Chart.register(Tooltip);

const colors = {
  success: '#66bb6a',
  error: '#f44336',
  coinColor: '#ce93d8'
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const toastConfig: ToastConfig = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light'
};

const TradingSingleView: React.FC<any> = ({ selectedCoin, open, handleClose }) => {
  const [priceData, setPriceData] = useState(null);
  const [marketPeriod, setMarketPeriod] = React.useState<number | string>(1);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${selectedCoin.id}/market_chart?vs_currency=usd&days=${marketPeriod}`
        );
        const data = await response.json();
        setPriceData(data.prices);
      } catch (error) {
        console.error('Error fetching price data:', error);
        toast.error(LOADING_ERROR, toastConfig);
      }
    };
    fetchPriceData();
  }, [selectedCoin, marketPeriod]);

  const updateMarketPeriod = (event: React.SyntheticEvent, newValue: string | number) => {
    setMarketPeriod(newValue);
    setPriceData(null);
  };

  const formatDate = (timestamp: Date) => {
    const date = new Date(timestamp);
    if (marketPeriod === 1) {
      return `${date.getHours() < 10 ? '0' : ''}${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
    } else {
      return `${date.getMonth() < 10 ? '0' : ''}${date.getMonth() + 1}/${date.getDate() < 10 ? '0' : ''}${date.getDate()}`;
    }
  };

  const formatPriceData = (data: any) => {
    const updatedData: any = data.map(([timestamp, price]: any) => ({
      x: formatDate(timestamp),
      y: price
    }));
    return removeDuplicates(updatedData, 'x');
  };

  const closeModel = () => {
    handleClose();
    setPriceData(null);
  };

  const chartData = {
    datasets: [
      {
        label: `${selectedCoin.id.toUpperCase()} Price (USD)`,
        data: priceData ? formatPriceData(priceData) : [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        borderWidth: 1,
        multiTooltipTemplate: '<%= value %>',
        tooltips: {
          mode: 'index',
          intersect: false
        }
      }
    ]
  };

  return (
    <Modal
      open={open}
      onClose={closeModel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2"></Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Grid item xs={12}>
                <h5>
                  <img src={selectedCoin.image} style={{ width: 25, marginRight: 8 }} />
                  {selectedCoin.name}{' '}
                  <span style={{ fontSize: 13, textTransform: 'uppercase' }}>
                    {selectedCoin.symbol}
                  </span>
                </h5>
                <h1>
                  {formatCurrency('USD', selectedCoin.current_price)}{' '}
                  <span
                    style={{
                      color:
                        selectedCoin.price_change_percentage_24h_in_currency >= 0
                          ? colors.success
                          : colors.error,
                      fontSize: 20
                    }}
                  >
                    {selectedCoin.price_change_percentage_24h_in_currency >= 0 ? (
                      <>&#8613; </>
                    ) : (
                      <>&#8615; </>
                    )}
                    {formatNumber(selectedCoin.price_change_percentage_24h_in_currency)}%
                  </span>
                </h1>
              </Grid>
              <Grid item xs={12}>
                <TableContainer>
                  <Table sx={{ minWidth: 200 }} aria-label="custom table">
                    <TableBody>
                      <TableRow key={1}>
                        <TableCell component="th" scope="row">
                          Market Cap
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 700 }}>
                          {formatCurrency('USD', selectedCoin.market_cap)}
                        </TableCell>
                      </TableRow>
                      <TableRow key={1}>
                        <TableCell component="th" scope="row">
                          Fully Diluted Valuation
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 700 }}>
                          {formatCurrency('USD', selectedCoin.fully_diluted_valuation)}
                        </TableCell>
                      </TableRow>
                      <TableRow key={1}>
                        <TableCell component="th" scope="row">
                          24 Hour Trading Vol
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 700 }}>
                          {formatCurrency('USD', selectedCoin.total_volume)}
                        </TableCell>
                      </TableRow>
                      <TableRow key={1}>
                        <TableCell component="th" scope="row">
                          Market cap change in 24h
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 700 }}>
                          {formatCurrency('USD', selectedCoin.market_cap_change_24h)}
                        </TableCell>
                      </TableRow>
                      <TableRow key={1}>
                        <TableCell component="th" scope="row">
                          Circulating Supply
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 700 }}>
                          {selectedCoin.circulating_supply}
                        </TableCell>
                      </TableRow>
                      <TableRow key={1}>
                        <TableCell component="th" scope="row">
                          Total Supply
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 700 }}>
                          {selectedCoin.total_supply}
                        </TableCell>
                      </TableRow>
                      <TableRow key={1}>
                        <TableCell component="th" scope="row">
                          Max Supply
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 700 }}>
                          {selectedCoin.max_supply}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
            <Grid item xs={8}>
              <h3>Price Changes Graph for {selectedCoin.name}</h3>
              <Box sx={{ borderBottom: 0 }}>
                <Tabs
                  aria-label="basic tabs example"
                  value={marketPeriod}
                  onChange={updateMarketPeriod}
                >
                  <Tab label="24h" value={1} />
                  <Tab label="7d" value={7} />
                  <Tab label="1m" value={30} />
                  <Tab label="3m" value={90} />
                  <Tab label="1y" value={365} />
                  <Tab label="Max" value="max" />
                </Tabs>
              </Box>
              {priceData ? <Line data={chartData} /> : <Loader />}
            </Grid>
          </Grid>
        </Typography>
      </Box>
    </Modal>
  );
};

export default TradingSingleView;
