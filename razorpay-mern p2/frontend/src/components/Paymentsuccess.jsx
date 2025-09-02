import React from 'react'
import { useSearchParams } from 'react-router-dom'
function Paymentsuccess() {

  const searchquery = useSearchParams()[0]
  const referenceNum = searchquery.get("reference")

  return (
    <>
    <div>order sussceful</div>
    <div>payment_ID = {referenceNum}</div>
    </>
    
  )
}

export default Paymentsuccess