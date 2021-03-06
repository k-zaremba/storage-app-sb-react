import React from 'react'
import './OrderProduct.css'
import { Divider } from 'antd';

const OrderProduct = (props) =>{

    return (
        <>
        <div className='hist-history-item'>
            <div className='hist-item-name'>{props.itemInfo.product.name}</div>
            <div className='hist-item-count'>{props.itemInfo.quantity}</div>
        </div>
        <Divider style={{margin : '1px 0'}}/>
        </>
    )
}

export default OrderProduct