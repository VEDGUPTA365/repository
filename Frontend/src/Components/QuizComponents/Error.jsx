import React from 'react'

const Error = ({ errorMsg }) => {
  return (
    <main className="text-red-500 font-bold">
      {errorMsg || "There was an Error in fetching Questions"}
    </main>
  )
}

export default Error