import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";


function FAQ() {
  const faqs = [
    {
      question: "How do I hire developers on DenyDev?",
      answer:
        "Clients can browse developer profiles, review skills, and hire developers directly through the platform.",
    },
    {
      question: "How are payments managed?",
      answer:
        "Payments are securely processed through the platform after project approval and delivery.",
    },

    {
      question: "Can I track project progress?",
      answer:
        "Yes, DenyDev provides project tracking, real-time chat, and progress updates.",
    },

    {
      question: "Is DenyDev secure?",
      answer:
        "Yes, we use secure authentication systems and protected communication channels.",
    },

    {
      question: "Can developers work remotely?",
      answer:
        "Yes, developers and clients can collaborate remotely from anywhere.",
    },
  ];
  const [ openIndex , setOpenIndex] = useState(null);

  const toggleFAQ  = (index)=>{
setOpenIndex(openIndex === index ? null : index)
  }
  return (
    <>
      <section className="w-full min-h-screen bg-white py-24 px-10">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-purple-900">
            {" "}
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-lg mt-5">
            {" "}
            Everything you need to know about DenyDev.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-20 space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-purple-50 rounded-2xl p-6 shadow-md cursor-pointer" onClick={()=> toggleFAQ(index)}>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">{faq.question}</h2>
                {openIndex === index ? (<FaChevronUp className="text-blue-600"/>): (<FaChevronDown className="text-blue-600"/>)}
              </div>
              {
                openIndex === index && (

                    <p className="text-gray-600 mt-5 leading-7">{faq.answer}</p>
                )
              }
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
export default FAQ;
