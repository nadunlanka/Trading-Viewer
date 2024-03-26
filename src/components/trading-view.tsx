import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from './spinner';
import {
  Coin,
  Currencies,
  EnhancedTableProps,
  HeadCell,
  ToastConfig,
  TradingData,
  formatCurrency,
  formatNumber
} from '../utils';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableHead } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { COIN_GECKO_API, COIN_GECKO_COIN_URL, COIN_GECKO_IMAGE_URL, LOADING_ERROR } from '../const';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';

const TradingDataTable: React.FC = () => {
  const colors = {
    success: '#66bb6a',
    error: '#f44336',
    coinColor: '#ce93d8'
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

  const [data, setData] = useState<TradingData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currencies] = useState<Currencies>({ currency: 'USD' });
  const [activePage, setActivePage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(15);
  const [page] = React.useState(0);
  const [currencyCount, setCurrencyCount] = React.useState(0);
  const [coins, setCoins] = React.useState<Coin[]>([]);
  const [filteredCoin, setFilteredCoin] = React.useState<Coin | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = `${COIN_GECKO_API}/coins/markets?vs_currency=${currencies.currency}&page=${activePage + 1}&per_page=${rowsPerPage}&price_change_percentage=1h,24h,7d`;

        if (filteredCoin) {
          url = `${url}&ids=${filteredCoin.id}`;
        }
        const response = await axios.get(url);
        setData(response.data);
      } catch (error: unknown) {
        toast.error(LOADING_ERROR, toastConfig);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activePage, rowsPerPage, filteredCoin]);

  useEffect(() => {
    const fetchGlobalData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${COIN_GECKO_API}/global`);
        setCurrencyCount(response.data.data.active_cryptocurrencies);
      } catch (error: unknown) {
        toast.error(LOADING_ERROR, toastConfig);
      } finally {
        setLoading(false);
      }
    };
    fetchGlobalData();
  }, []);

  useEffect(() => {
    const fetchCoinData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${COIN_GECKO_API}/coins/list`);
        setCoins(response.data);
      } catch (error: unknown) {
        toast.error(LOADING_ERROR, toastConfig);
      } finally {
        setLoading(false);
      }
    };
    fetchCoinData();
  }, []);

  const getCoinId = (imageLink: string) => {
    return parseInt(imageLink.split(`${COIN_GECKO_IMAGE_URL}/`)[1].split('/large/')[0]);
  };

  const handleOnSelect = (item: Coin) => {
    setFilteredCoin(item);
  };

  const handleOnClear = () => {
    setFilteredCoin(null);
  };

  const headCells: HeadCell[] = [
    {
      id: 'id',
      numeric: false,
      disablePadding: false,
      label: '#'
    },
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: 'Coin'
    },
    {
      id: 'current_price',
      numeric: true,
      disablePadding: false,
      label: 'Price'
    },
    {
      id: 'price_change_percentage_1h_in_currency',
      numeric: true,
      disablePadding: false,
      label: '1h'
    },
    {
      id: 'price_change_percentage_24h_in_currency',
      numeric: true,
      disablePadding: false,
      label: '24h'
    },
    {
      id: 'price_change_percentage_7d_in_currency',
      numeric: true,
      disablePadding: false,
      label: '7d'
    },
    {
      id: 'total_volume',
      numeric: true,
      disablePadding: false,
      label: 'Total Volume'
    },
    {
      id: 'market_cap',
      numeric: true,
      disablePadding: false,
      label: 'Mkt Cap'
    },
    {
      id: 'low_24h',
      numeric: true,
      disablePadding: false,
      label: 'Last 7 Days'
    }
  ];

  const EnhancedTableHead = (props: EnhancedTableProps) => {
    const { order, orderBy } = props;

    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              {headCell.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  const FilterByCoin = () => {
    return (
      <ReactSearchAutocomplete
        items={coins}
        onSelect={handleOnSelect}
        inputSearchString={filteredCoin?.id}
        onClear={handleOnClear}
        placeholder="Filter by coin"
      />
    );
  };

  return (
    <>
      <h1>Trading View</h1>

      {loading ? (
        <Loader />
      ) : (
        <>
          <FilterByCoin />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
              <EnhancedTableHead order={'asc'} orderBy={'asc'} />
              <TableBody>
                {(rowsPerPage > 0
                  ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : data
                ).map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.market_cap_rank}
                    </TableCell>
                    <TableCell>
                      <div className="display-in-row">
                        <div>
                          <img src={row.image} alt="" width={16} />{' '}
                        </div>
                        <div style={{ fontWeight: 500, margin: '0px 10px' }}>{row.name}</div>{' '}
                        <div
                          style={{
                            color: colors.coinColor,
                            fontSize: '12px'
                          }}
                        >
                          {row.symbol.toUpperCase()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(currencies.currency as string, row.current_price)}
                    </TableCell>
                    <TableCell align="right">
                      <span
                        style={{
                          color:
                            row.price_change_percentage_1h_in_currency >= 0
                              ? colors.success
                              : colors.error
                        }}
                      >
                        {row.price_change_percentage_1h_in_currency >= 0 ? (
                          <>&#8613; </>
                        ) : (
                          <>&#8615; </>
                        )}
                        {formatNumber(row.price_change_percentage_1h_in_currency)}%
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      <span
                        style={{
                          color:
                            row.price_change_percentage_24h_in_currency >= 0
                              ? colors.success
                              : colors.error
                        }}
                      >
                        {row.price_change_percentage_24h_in_currency >= 0 ? (
                          <>&#8613; </>
                        ) : (
                          <>&#8615; </>
                        )}
                        {formatNumber(row.price_change_percentage_24h_in_currency)}%
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      <span
                        style={{
                          color:
                            row.price_change_percentage_7d_in_currency >= 0
                              ? colors.success
                              : colors.error
                        }}
                      >
                        {row.price_change_percentage_7d_in_currency >= 0 ? (
                          <>&#8613; </>
                        ) : (
                          <>&#8615; </>
                        )}
                        {formatNumber(row.price_change_percentage_7d_in_currency)}%
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(currencies.currency as string, row.total_volume)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(currencies.currency as string, row.market_cap)}
                    </TableCell>
                    <TableCell align="right">
                      <div style={{ marginTop: '5px' }}>
                        <img
                          src={`${COIN_GECKO_COIN_URL}/${getCoinId(row.image)}/sparkline.svg`}
                          alt=""
                          width={100}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 15, 25]}
            component="div"
            count={currencyCount as number}
            rowsPerPage={rowsPerPage}
            page={activePage}
            onPageChange={(event: unknown, newPage: number) => {
              setActivePage(newPage);
            }}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
            }}
          />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </>
      )}
    </>
  );
};

export default TradingDataTable;
