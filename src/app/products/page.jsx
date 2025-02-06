// import { redirect } from 'next/navigation';
import React from 'react'

export default async function ProductsPage() {
    const res = await fetch(
      `https://nextjs-data-fetching-2mzd.vercel.app/api/items`,
      {
        cache: "force-cache",
      }
    );
    const data = await res.json();

    // if (data?.data?.length > 3) {
    //     redirect('/')
    // }

  return (
      <ul className='text-center mt-8'>
          {data?.data?.map((singleProduct) => {
              return <li key={singleProduct._id}>{ singleProduct?.productName}</li>
          })
          }
          
    </ul>
  )
}
