import axios from "axios";
import React, { useEffect, useState } from "react";
import HorSlider from "./HorSlider";
import { brandsData } from "./GenInfo";

const ShopBy = ({ filter, title }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        if (filter === "bestSellers") {
          const mapped = brandsData.map((b, idx) => ({
            _id: `brand-${b.name.toLowerCase()}`,
            img: b.src,
            title: `${b.name} Shoes`,
            sellPrice: 1999 + idx * 100,
            mrp: 2499 + idx * 100,
            discount: Math.round(((2499 - (1999 + idx * 100)) / 2499) * 100),
            brand: b.name,
            category: "men",
            rating: 4.2,
          }));

          if (isMounted) {
            setProducts(mapped);
            setLoading(false);
          }
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/filter/${filter}`
        );
        if (isMounted) {
          setProducts(res.data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error(`Error while fetching products: ${err.message}`);
          setError(err);
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [filter]);

  return (
    <>
      <div className="mt-10 mb-2 text-2xl">{title}</div>
      <div className="overflow-y-hidden md:max-w-full scroll-container mb-10 mx-auto relative scroll-container">
        {loading && <p>Loading...</p>}
        {error && <p>Error while fetching: {error.message}</p>}

        <div className="flex flex-nowrap space-x-4">
          {/* Ensure products is always an array */}
          {(Array.isArray(products) ? products : []).map((elem) => (
            <HorSlider
              product={elem}
              key={elem._id || elem.id} 
              className="inline-block"
              home={true}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ShopBy;
