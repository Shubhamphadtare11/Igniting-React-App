import RestaurantCard, {withPromtedLabel} from "./RestaurantCard";
import { useState, useEffect, useContext } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import useOnlineStatus from "../utils/useOnlineStatus";
import UserContext from "../utils/UserContext";


const Body = () => {
    //local state variable - super powerful variable
    const [listOfRestaurants, setListOfRestaurant] = useState([]);
    const [filteredRestaurant, setFilteredRestaurant] = useState([]);
    const [searchText, setSearchText] = useState("");

    //const RestaurantCardPromoted = withPromtedLabel(RestaurantCard);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
       
        const data = await fetch("https://www.swiggy.com/dapi/restaurants/list/v5?lat=18.5204303&lng=73.8567437&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING");
    
        const json = await data.json();
 
        setListOfRestaurant(json?.data?.cards[5]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
        setFilteredRestaurant(json?.data?.cards[5]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
    };


    const onlineStatus = useOnlineStatus();

    if(onlineStatus === false) 
        return <h1>looks like you are offline, please check internet connection</h1>

    const {loggedInUser, setUserName} = useContext(UserContext);

    //Conditional Rendering
    return listOfRestaurants.length ===0 ? <Shimmer /> :(
        <div className="body">
            <div className="filter flex">
                <div className="search m-4 p-4">
                    <input type="text" className="search-box border border-solid border-black" value={searchText} 
                    onChange={ (e) =>
                        {setSearchText(e.target.value);}
                    } />
                    <button className="px-4 py-2 bg-green-100 m-4 rounded-lg"
                     onClick={
                        () => {
                            const filteredRestaurant = listOfRestaurants.filter(
                                (res) => res.info.name.toLowerCase().includes(searchText.toLowerCase()));
                                setFilteredRestaurant(filteredRestaurant);
                        }
                    }>Search</button>
                </div>
            <div className="search m-4 p-4 flex items-center">
            <button className="filter-btn px-4 py-2 bg-gray-100 rounded-lg" onClick={
                    () =>{
                        const filteredList= listOfRestaurants.filter((res) => res.info.avgRating>4);
                        setListOfRestaurant(filteredList);
                    }
                    }>
                    Top Rated Restaurants</button>
            </div>
            <div className="search m-4 p-4 flex items-center">
                    <label>User : </label>
                    <input className="border border-black p-2" value={loggedInUser} onChange={(e) => setUserName(e.target.value)} />
            </div>
            </div>
            <div className="res-container flex flex-wrap">
          {
            filteredRestaurant.map((restaurant) => (
            <Link key={restaurant.info.id} to={"/restaurants/" + restaurant.info.id}>
                                {restaurant?.info.promoted ? (<RestaurantCardPromoted resData={restaurant?.info}/>) : (<RestaurantCard resData={restaurant?.info}/>)}
                
                </Link> 
            ))
          }
            </div>
        </div>
    )
}

export default Body; 