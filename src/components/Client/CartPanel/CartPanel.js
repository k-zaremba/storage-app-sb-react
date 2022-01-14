import React, { useState } from 'react'
import './CartPanel.css'
import { Table, Space, Divider, Spin, Tag, Button, BackTop} from 'antd';
import { PlusOutlined, MinusOutlined, CloseOutlined, UpCircleFilled } from '@ant-design/icons';

import cart from '../../../cart';

const CartPanel = (props) => {
    const [spinner, setSpinner] = useState(false)

    var data;

    const isUserRegular = () => {
        var item = sessionStorage.getItem('user')
        var user = item ? JSON.parse(item) : {}

        if (user.client.isRegular)
            return true;
        else return false;
    }

    const getListProducts = () => {
        var multiplier = 1;

        if (isUserRegular())
            multiplier = 0.8;

        var shoppingListContent = cart.getProducts();
        data = [];

        for (var id in shoppingListContent) {
            var obj = {
                id: id,
                name: shoppingListContent[id].name,
                count: shoppingListContent[id].quantity,
                value: (shoppingListContent[id].price * shoppingListContent[id].quantity * multiplier)
            }
            data.push(obj)
        }

        return data;
    }

    const getShoppingListValue = () => {
        var item = sessionStorage.getItem('user')
        var user = item ? JSON.parse(item) : {}

        var value = 0;
        var shoppingListContent = cart.getProducts();

        for (var id in shoppingListContent) {
            value += shoppingListContent[id].price * shoppingListContent[id].quantity;
        }

        if (user.client.isRegular)
            value = value * 0.8;

        return value.toLocaleString(undefined, { minimumFractionDigits: 2 });
    }

    const postOrder = (orderMap) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(orderMap)
        };

        var item = sessionStorage.getItem('user')
        var user = item ? JSON.parse(item) : {}

        fetch(`http://localhost:8080/shop/order/register?clientId=${user.client.id}`, requestOptions)
            .then(res => res.json())
            .then((res) => {
                console.log(res)
                sessionStorage.setItem('activeOrderId', res.id)
            })
    }

    const placeOrder = () => {
        setSpinner(true)
        setTimeout(() => {
            setSpinner(false);
            var orderMap = cart.getProductsOrderMap()
            postOrder(orderMap)
            props.setActiveWindow(4);
        }, 1000);
    }

    const columns = [
        {
            title: 'Produkt',
            dataIndex: 'name',
            key: 'name',
            render: val => <p style={{ fontSize: '22px', margin: 'auto' }}>{val}</p>,
        },
        {
            title: 'Ilość',
            dataIndex: 'count',
            key: 'count',
            render: val => <p style={{ fontSize: '22px', margin: 'auto' }}>{val}</p>,
        },
        {
            title: 'Cena',
            dataIndex: 'value',
            key: 'value',
            render: val => <p style={{ fontSize: '22px', margin: 'auto' }}>{val.toFixed(2)} zł</p>,
        },
        {
            title: 'Edycja',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button style={{ border: 'none' }} icon={<MinusOutlined />} onClick={() => { console.log(record); cart.updateProduct(record, -1); props.forceShoppingListUpdate(); props.forceStoreUpdate() }} />
                    <Button style={{ border: 'none' }} icon={<PlusOutlined />} onClick={() => { console.log(record); cart.updateProduct(record, 1); props.forceShoppingListUpdate(); props.forceStoreUpdate()}} />
                    <Button type='danger' style={{ border: 'none', background: 'white', color: 'red', boxShadow: '0 2px 0 rgb(0 0 0 / 2%)' }} icon={<CloseOutlined />} onClick={() => { cart.deleteProduct(record); props.forceShoppingListUpdate(); props.forceStoreUpdate()}} />
                </Space>
            ),
        },
    ];


    return (
        <div className='payment-panel-client'>
            <div className='payment-title-client'>
                PODSUMOWANIE
            </div>
            <Divider />
            <div className='cart-payment-summary'>
            {cart.isNotEmpty() &&
                <>
                    <Table pagination={false} columns={columns} dataSource={getListProducts()} />
                    {!spinner && isUserRegular() && <div className='payment-box-summary'>
                        <div className='payment'>
                        <Tag style={{ fontSize: '15px', height : '35px', display : 'flex', alignItems : 'center' }} color="geekblue">STAŁY KLIENT -20%</Tag>
                            <div className='summary'>
                                {'SUMA: ' + parseFloat(getShoppingListValue()).toFixed(2)} zł
                            </div>
                            <Button type="primary" shape="default" size={'large'} onClick={() => { placeOrder() }}>
                                Złóż zamówienie
                            </Button>
                        </div>
                    </div>}

                    {!spinner && !isUserRegular() && <div className='payment'>
                            <div className='summary'>
                                {'SUMA: ' + getShoppingListValue().toLocaleString(undefined, { minimumFractionDigits: 2 })} zł
                            </div>
                            <Button type="primary" shape="default" size={'large'} onClick={() => { placeOrder() }}>
                                Złóż zamówienie
                            </Button>
                    </div>}

                    {spinner &&
                        <div style={{ textAlign: 'right', marginRight: '70px', marginTop: '70px' }}>
                            <Spin />
                        </div>
                    }

                </>
            }
            </div>
            <BackTop>
                <UpCircleFilled style={{fontSize : '40px', color : 'rgb(0,21,41)'}}/>
            </BackTop>
        </div>
    )
}
export default CartPanel