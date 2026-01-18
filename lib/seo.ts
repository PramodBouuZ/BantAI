
export const generateProductKeywords = (productName: string): string => {
  const primaryKeywords = [
    productName,
    `${productName} provider`,
    `${productName} vendor`,
    `${productName} company`,
  ];

  const commercialKeywords = [
    `${productName} price in India`,
    `best ${productName} in India`,
    `${productName} for business`,
    `${productName} for small business`,
    `${productName} for enterprise`,
    `${productName} demo`,
    `${productName} buy online`,
    `${productName} reseller India`,
  ];

  const useCaseKeywords = [
    `${productName} for call center`,
    `${productName} for sales team`,
    `${productName} for customer support`,
    `${productName} for AI calling agent`,
  ];

  const locationKeywords = [
    'Noida', 'Delhi', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad', 'Gurgaon', 'Chennai', 'Kolkata'
  ].map(city => `${productName} in ${city}`);

  return [
    ...primaryKeywords,
    ...commercialKeywords,
    ...useCaseKeywords,
    ...locationKeywords
  ].join(', ');
};

export const generateFaqs = (product: { title: string; priceRange: string; }) => {
  return [
    {
      question: `What is ${product.title} used for?`,
      answer: `${product.title} is primarily used for [Primary Use Case]. It helps businesses streamline operations, improve customer relations, and enhance efficiency in areas like sales, marketing, and project management.`
    },
    {
      question: `How much does ${product.title} cost in India?`,
      answer: `The typical price for ${product.title} starts from ${product.priceRange}. The final cost depends on the number of users, specific features required, and the level of customization. Contact us for a detailed quote.`
    },
    {
      question: `Is ${product.title} suitable for small businesses?`,
      answer: `Yes, ${product.title} is highly scalable and offers packages suitable for small to medium-sized businesses (SMBs) as well as large enterprises. Its flexible pricing and feature set make it a popular choice for growing companies.`
    },
    {
      question: `Can ${product.title} integrate with CRM / ERP / API?`,
      answer: `Absolutely. Most modern solutions like ${product.title} come with robust integration capabilities, including standard APIs (REST, SOAP) to connect with your existing CRM, ERP, accounting software, and other business tools.`
    },
    {
      question: `How to choose the best ${product.title} vendor?`,
      answer: `When choosing a vendor, look for their industry experience, customer support quality, implementation process, and training options. BantConfirm lists only verified vendors to ensure you partner with the best.`
    },
    {
      question: `Is there a free trial or demo available for ${product.title}?`,
      answer: `Many vendors for ${product.title} offer a free, personalized demo to showcase the product's capabilities. Some may also provide a limited-time free trial. You can request a demo directly through BantConfirm.`
    }
  ];
};
