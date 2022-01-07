import React, { useState } from 'react'
import './CashPaymentConfirmationPanel.css'

const CashPaymentConfirmationPanel = (props) => {
    const [time, setTime] = useState(5);

    const countDown = () => {
        if(time === 0)  return;

        setTimeout(function() {
            setTime(time-1);
        }, 1000);
    }

    const redirect = () => {
        if(time === 0){
            setTimeout(function() {
                props.setOption(1);
            }, 300);
        }
    }

    const renderTimer = () => {

        countDown();
        redirect();
        return time;
    }

    return(
    <div className='confirmation-panel'>
        <div className='confirmation-title'>
            Zapraszamy do płatności przy odbiorze!
        </div>

        <div className='redirect-text'>
            Zostaniesz przeniesiony na stronę główną za {renderTimer()}...
        </div>
    </div>          
    )
}
export default CashPaymentConfirmationPanel