import React, { useState, useEffect } from 'react';
import { Table, Tooltip } from 'antd';
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import { FETCH_BILLING_HISTORY, GET_INVOICE_URL, BASE_URL } from '../../Constants/Urls';
import { PAYMENT_STATUS_ENUM, PAYMENT_STATUS_TEXT } from '../../Constants/Values';
import { getAPI, interpolate } from '../../Utils/ApiCalls';
import { isArrayEmpty, isEmptyObject, getDateTimeText, downloadFile } from '../../Utils/HelperFunctions';
import { getTableSkeleton } from '../UI Elements/Skeleton/GeneralSkeleton';
import { Helmet } from 'react-helmet';

const columns = [
    {
        title: 'Order Id',
        dataIndex: 'order_id',
        key: 'order_id'
    },
    {
        title: 'Order Creation Date',
        dataIndex: 'order_creation_date',
        key: 'order_creation_date'
    },
    {
        title: 'Payment Attempted At',
        dataIndex: 'payment_attempt_date',
        key: 'payment_attempt_date'
    },
    {
        title: 'Course',
        dataIndex: 'course',
        key: 'course'
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status'
    },
    {
        title: '',
        dataIndex: 'download',
        key: 'download',
        fixed: 'right',
        width: 80
    }
];
const BillingHistory = props => {
    const [billing_history, setBillingHistory] = useState({});
    const [invoice_order, setInvoiceOrder] = useState({});
    const [loading_initial_billing_history, setLoadingInitialBillingHistory] = useState(false);
    const [loading_more_billing_history, setLoadingMoreBillingHistory] = useState(false);
    const [loading_invoice_url, setLoadingInvoiceUrl] = useState(false);

    useEffect(() => {
        setLoadingInitialBillingHistory(true);
        getAPI(FETCH_BILLING_HISTORY)
            .then(response => {
                response.results = annotateData(response.results);
                setBillingHistory(response);
                setLoadingInitialBillingHistory(false);
            })
            .catch(err => {
                setLoadingInitialBillingHistory(false);
            });
    }, []);

    useEffect(() => {
        if (!isEmptyObject(invoice_order)) {
            setBillingHistory(prevState => {
                let prev_billing_history = Object.assign({}, prevState);
                prev_billing_history.results = prev_billing_history.results.map(x => {
                    if (x.id !== invoice_order.id) return x;
                    return { ...x, download: getDownloadIcon(invoice_order) };
                });
                return prev_billing_history;
            });
        }
    }, [loading_invoice_url]);

    const getInvoiceUrl = order => {
        if (!!order.payments[0].invoice_url) {
            downloadFile(order.payments[0].invoice_url);
        } else {
            setLoadingInvoiceUrl(true);
            setInvoiceOrder(order);
            getAPI(interpolate(GET_INVOICE_URL, [order.payments[0].id]))
                .then(response => {
                    downloadFile(response.invoice_url);
                    setLoadingInvoiceUrl(false);
                })
                .catch(err => {
                    setLoadingInvoiceUrl(false);
                });
        }
    };

    const getDownloadIcon = order => {
        return order.status === PAYMENT_STATUS_ENUM.SUCCESS ? (
            <>
                <Tooltip placement='bottomRight' title='Download Invoice'>
                    <DownloadOutlined
                        className='billing-history-download primary-color place-center'
                        onClick={() => getInvoiceUrl(order)}
                    />
                </Tooltip>
                {loading_invoice_url && <LoadingOutlined />}
            </>
        ) : null;
    };

    const annotateData = orderList => {
        return orderList.map(order => ({
            ...order,
            key: order.id,
            order_id: order.gateway_order_id,
            order_creation_date: getDateTimeText(order.created_at),
            payment_attempt_date: !isArrayEmpty(order.payments) ? getDateTimeText(order.payments[0].created_at) : null,
            course: order.course,
            status: PAYMENT_STATUS_TEXT[order.status],
            download: getDownloadIcon(order)
        }));
    };

    const onChangePageNumber = pageNumber => {
        setLoadingMoreBillingHistory(true);
        let url_prefix = !!billing_history.next
            ? billing_history.next.split('?')[0]
            : billing_history.previous.split('?')[0];
        getAPI(`${url_prefix}?page=${pageNumber}`.replace(BASE_URL, ''))
            .then(response => {
                response.results = annotateData(response.results);
                setBillingHistory(response);
                setLoadingMoreBillingHistory(false);
            })
            .catch(err => {
                setLoadingMoreBillingHistory(false);
            });
    };
    return (
        <>
            <Helmet>
                <title>{`Billing History`}</title>
                <meta name='description' content={`Billing history for CodesDope`} />
            </Helmet>
            <div className='billing-history-wrapper mt-xxl ml-xl mr-xl'>
                <h1>Billing History</h1>
                {!loading_initial_billing_history ? (
                    <Table
                        className='billing-history-table default-card-neu mt-xl'
                        style={{ whiteSpace: 'nowrap' }}
                        columns={columns}
                        dataSource={billing_history.results}
                        scroll={{ x: true }}
                        tableLayout='auto'
                        bordered={true}
                        loading={loading_more_billing_history}
                        pagination={{
                            defaultCurrent: 1,
                            total: billing_history.count,
                            onChange: onChangePageNumber,
                            position: ['bottomRight'],
                            showSizeChanger: false,
                            size: 'small'
                        }}
                    />
                ) : (
                    <div className='default-card-neu mt-xl'>{getTableSkeleton(columns, 10)}</div>
                )}
            </div>
        </>
    );
};

export default BillingHistory;
