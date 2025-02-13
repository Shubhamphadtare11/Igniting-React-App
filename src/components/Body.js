import RestaurantCard, { withPromtedLabel } from "./RestaurantCard";
import { useState, useEffect, useContext } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import useOnlineStatus from "../utils/useOnlineStatus";
import { AiOutlineSearch, AiOutlineStar } from "react-icons/ai";
import ShimmerCursor from "./ShimmerCursor";
import RestaurantCardAPI from "../utils/APIData/RestaurantCardAPI.json";

const Body = () => {
  //local state variable - super powerful variable
  const [listOfRestaurants, setListOfRestaurant] = useState([]);
  const [filteredRestaurant, setFilteredRestaurant] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [Loading, setLoading] = useState(false);

  // const RestaurantCardPromoted = withPromtedLabel(RestaurantCard);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      fetchData()
    }, 1000);
    setLoading(false);
  }, []);


  const fetchData = () => {
          setListOfRestaurant(
            RestaurantCardAPI[0]?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle
              ?.restaurants
          );
          setFilteredRestaurant(
            RestaurantCardAPI[0]?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle
              ?.restaurants
          );
    
  };

 // console.log(RestaurantCardAPI)

  const onlineStatus = useOnlineStatus();

  if (onlineStatus === false)
    return (
      <h1>looks like you are offline, please check internet connection</h1>
    );

    const allRestaurants = ()=>{
      const allRestaurantsList = listOfRestaurants;

      setFilteredRestaurant(allRestaurantsList);
    }

  const handleTopratingRestaurant = () => {
    const filterTopRatedRestaurant = listOfRestaurants.filter(
      (res) => res.info.avgRating > 4
    );
    setFilteredRestaurant(filterTopRatedRestaurant);
  };

  const handleBelowPrice = () => {
    setListOfRestaurant(listOfRestaurants);
    const FindBelowPrice = listOfRestaurants.filter(
      (res) => res?.info?.costForTwo < "₹300 for two"
    );
    // console.log(findPriceRange);
    setFilteredRestaurant(FindBelowPrice);
  };

  const handleAbovePrice = () => {
    setListOfRestaurant(listOfRestaurants);
    const findGreaterprice = listOfRestaurants.filter(
      (res) => res?.info?.costForTwo >= "₹300 for two"
    );
    // console.log(findGreaterprice);
    setFilteredRestaurant(findGreaterprice);
  };

  if (!listOfRestaurants) {
    return (
      <div>
        <ShimmerCursor />
        <Shimmer />
      </div>
    );
  }

  //Conditional Rendering
  return listOfRestaurants?.length === 0 ? (
    <div>
      <ShimmerCursor />
      <Shimmer />
    </div>
  ) : (
    <>
      <div className="body container mx-auto ">
        <div className="">
          <div className="headingTitle">
            <h4 className=" sm:text-2xl" style={{ fontWeight: "bolder" }}>
              Restaurants With Online Food Delivery
            </h4>
          </div>
          <div className="filter grid grid-cols-12">
            <div className="searchFiltered col-span-12 md:col-span-8 flex flex-wrap items-center">
            <button
                className="filter-btn topRated px-4 py-2 my-1 bg-gray-100 "
                onClick={allRestaurants}
              >
                All Restaurants
              </button>
             
              <button
                className="filter-btn topRated px-4 py-2 my-1 bg-gray-100 "
                onClick={handleTopratingRestaurant}
              >
                Rating 4.0+
                <span className="inline-block ">
                  <AiOutlineStar style={{ color: "orange" }} />
                </span>
              </button>
              <button
                className="filter-btn topRated px-4 py-2 my-1 bg-gray-100 "
                onClick={handleBelowPrice}
              >
                Less than Rs.300
              </button>
              <button
                className="filter-btn topRated px-4 py-2 my-1 bg-gray-100 "
                onClick={handleAbovePrice}
              >
                More than Rs.300
              </button>
            </div>
            <div className="search col-span-12 md:col-span-4">
              <div className="flex items-center mx-3 sm:mx-0">
                <input
                  type="text"
                  data-testid="searchInput"
                  placeholder="Search for restaurant and food"
                  className="search-box px-3 py-[3px] rounded-lg w-[23rem] border border-solid border-gray-400"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                  }}
                />
                <button
                  className="px-4 py-2 searchBtn m-4 rounded-lg"
                  onClick={() => {
                    const filteredRestaurant = listOfRestaurants.filter((res) =>
                      res.info.name
                        .toLowerCase()
                        .includes(searchText.toLowerCase())
                    );
                    setFilteredRestaurant(filteredRestaurant);
                  }}
                >
                  <AiOutlineSearch />
                </button>
              </div>
            </div>
          </div>
          <div className="res-container  flex flex-wrap">
            {filteredRestaurant &&
              filteredRestaurant.map((restaurant) => (
                <Link
                  key={restaurant.info.id}
                  to={"/restaurants/" + restaurant.info.id}
                >
                  {/* {restaurant?.info?.promoted ? (
                  <RestaurantCardPromoted resData={restaurant?.info} />
                ) : ( */}
                  <RestaurantCard resData={restaurant?.info} />
                  {/* )} */}
                </Link>
              ))}
          </div>
        </div>
        {Loading && <Shimmer />}
      </div>
      
    </>
  );
};

export default Body;
