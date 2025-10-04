import React from 'react'
import FAQSection from '@/components/SharedComponents/FAQ/FAQSection'
import { faqData } from '@/components/SharedComponents/FAQ/FAQData'

function page() {
  return (
    <div>
        
        <FAQSection
        faqs={faqData}/>

    </div>
  )
}

export default page
