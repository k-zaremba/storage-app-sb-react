import React, { useState } from 'react'
import './CartClick.css'
import { Button } from 'antd';
import { Table, Space, Divider, Spin, Tag } from 'antd';
import { PlusOutlined, MinusOutlined, CloseOutlined } from '@ant-design/icons';
import cart from '../../../../cart';

const CartClick = (props) => {
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
                value: shoppingListContent[id].price * shoppingListContent[id].quantity * multiplier
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

        return value;
    }

    const columns = [
        {
            title: 'Produkt',
            dataIndex: 'name',
            key: 'name',
            render: val => <p style={{ fontSize: '16px', margin: 'auto' }}>{val}</p>,
        },
        {
            title: 'Ilość',
            dataIndex: 'count',
            key: 'count',
            render: val => <p style={{ fontSize: '16px', margin: 'auto' }}>{val}</p>,
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
        <div>
            {cart.isNotEmpty() &&
                <>
                    <Table size='small' className='body-body' pagination={false} columns={columns} dataSource={getListProducts()} />
                    {!spinner && isUserRegular() && <div className='payment-box'>
                        <Tag style={{ fontSize: '15px' }} color="geekblue">-20%</Tag>
                        <div className='payment'>
                            <div className='summary'>
                                {'SUMA: ' + parseFloat(getShoppingListValue()).toFixed(2)} zł
                            </div>
                            <Button type="primary" shape="default" size={'large'} onClick={() => { props.setActiveWindow(8); props.hideCart() }}>
                                Podsumowanie
                            </Button>
                        </div>
                    </div>}

                    {!spinner && !isUserRegular() && <div className='payment'>
                            <div className='summary'>
                                {'SUMA: ' + parseFloat(getShoppingListValue()).toFixed(2)} zł
                            </div>
                            <Button type="primary" shape="default" size={'large'} onClick={() => { props.setActiveWindow(8); props.hideCart()}}>
                            Podsumowanie
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
    )
}

export default CartClick