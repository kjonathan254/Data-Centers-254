"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Cable, Network, Server, Zap, Info, X, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

// East Africa Data Center & Infrastructure Data
const infrastructureData = {
  kenya: {
    name: "Kenya",
    coordinates: { lat: -0.0236, lng: 37.9062 },
    dataCenters: [
      {
        id: "ke-dc1",
        name: "Africa Data Centres (Nairobi)",
        type: "datacenter",
        city: "Nairobi",
        coordinates: { lat: -1.2921, lng: 36.8219 },
        capacity: "Tier III",
        power: "5MW",
        operator: "Africa Data Centres",
        year: 2012,
        description: "First carrier-neutral data centre in East Africa"
      },
      {
        id: "ke-dc2",
        name: "Equinix Nairobi",
        type: "datacenter",
        city: "Nairobi",
        coordinates: { lat: -1.2677, lng: 36.8078 },
        capacity: "Tier III",
        power: "3MW",
        operator: "Equinix",
        year: 2024,
        description: "Latest hyperscale-ready facility"
      },
      {
        id: "ke-dc3",
        name: "Liquid Intelligent Technologies DC",
        type: "datacenter",
        city: "Nairobi",
        coordinates: { lat: -1.2456, lng: 36.8123 },
        capacity: "Tier II",
        power: "2MW",
        operator: "Liquid Intelligent Technologies",
        year: 2015,
        description: "Regional connectivity hub"
      },
      {
        id: "ke-dc4",
        name: "Telkom Kenya Data Centre",
        type: "datacenter",
        city: "Nairobi",
        coordinates: { lat: -1.2833, lng: 36.8167 },
        capacity: "Tier III",
        power: "4MW",
        operator: "Telkom Kenya",
        year: 2018,
        description: "National carrier's flagship facility"
      },
      {
        id: "ke-dc5",
        name: "Mombasa Data Centre",
        type: "datacenter",
        city: "Mombasa",
        coordinates: { lat: -4.0435, lng: 39.6682 },
        capacity: "Tier II",
        power: "1.5MW",
        operator: "Paratus",
        year: 2020,
        description: "Coastal region facility near cable landing stations"
      }
    ],
    cables: [
      {
        id: "ke-c1",
        name: "SEACOM",
        type: "cable",
        landingPoint: "Mombasa",
        coordinates: { lat: -4.0435, lng: 39.6682 },
        year: 2009,
        capacity: "1.3 Tbps",
        description: "East African submarine cable system"
      },
      {
        id: "ke-c2",
        name: "TEAMS",
        type: "cable",
        landingPoint: "Mombasa",
        coordinates: { lat: -4.0435, lng: 39.6682 },
        year: 2009,
        capacity: "1.28 Tbps",
        description: "The East Africa Marine System"
      },
      {
        id: "ke-c3",
        name: "EASSy",
        type: "cable",
        landingPoint: "Mombasa",
        coordinates: { lat: -4.0435, lng: 39.6682 },
        year: 2010,
        capacity: "4.8 Tbps",
        description: "Eastern Africa Submarine System"
      },
      {
        id: "ke-c4",
        name: "DARE1",
        type: "cable",
        landingPoint: "Mombasa",
        coordinates: { lat: -4.0435, lng: 39.6682 },
        year: 2015,
        capacity: "960 Gbps",
        description: "Djibouti Africa Regional Express"
      },
      {
        id: "ke-c5",
        name: "LION2",
        type: "cable",
        landingPoint: "Mombasa",
        coordinates: { lat: -4.0435, lng: 39.6682 },
        year: 2012,
        capacity: "1.5 Tbps",
        description: "Lower Indian Ocean Network 2"
      }
    ],
    ixp: [
      {
        id: "ke-ixp1",
        name: "KIXP (Kenya Internet Exchange Point)",
        type: "ixp",
        city: "Nairobi",
        coordinates: { lat: -1.2921, lng: 36.8219 },
        members: 85,
        traffic: "25 Gbps",
        year: 2000,
        description: "One of Africa's largest IXPs"
      }
    ]
  },
  tanzania: {
    name: "Tanzania",
    coordinates: { lat: -6.369, lng: 34.8888 },
    dataCenters: [
      {
        id: "tz-dc1",
        name: "RasCut Submarine Cable Station",
        type: "datacenter",
        city: "Dar es Salaam",
        coordinates: { lat: -6.8161, lng: 39.2803 },
        capacity: "Tier II",
        power: "2MW",
        operator: "Tanzania Telecommunications Company Ltd",
        year: 2010,
        description: "Major cable landing station with colocation"
      },
      {
        id: "tz-dc2",
        name: "SimbaNet Data Centre",
        type: "datacenter",
        city: "Dar es Salaam",
        coordinates: { lat: -6.7924, lng: 39.2083 },
        capacity: "Tier II",
        power: "1.5MW",
        operator: "SimbaNet",
        year: 2016,
        description: "Commercial ISP data centre"
      },
      {
        id: "tz-dc3",
        name: "Liquid Tanzania DC",
        type: "datacenter",
        city: "Dar es Salaam",
        coordinates: { lat: -6.8, lng: 39.25 },
        capacity: "Tier III",
        power: "3MW",
        operator: "Liquid Intelligent Technologies",
        year: 2019,
        description: "Regional enterprise facility"
      }
    ],
    cables: [
      {
        id: "tz-c1",
        name: "SEACOM",
        type: "cable",
        landingPoint: "Dar es Salaam",
        coordinates: { lat: -6.8161, lng: 39.2803 },
        year: 2009,
        capacity: "1.3 Tbps",
        description: "East African submarine cable"
      },
      {
        id: "tz-c2",
        name: "EASSy",
        type: "cable",
        landingPoint: "Dar es Salaam",
        coordinates: { lat: -6.8161, lng: 39.2803 },
        year: 2010,
        capacity: "4.8 Tbps",
        description: "Eastern Africa Submarine System"
      },
      {
        id: "tz-c3",
        name: "TANZAM",
        type: "cable",
        landingPoint: "Dar es Salaam",
        coordinates: { lat: -6.8161, lng: 39.2803 },
        year: 2013,
        capacity: "640 Gbps",
        description: "Tanzania-Zambia terrestrial link"
      }
    ],
    ixp: [
      {
        id: "tz-ixp1",
        name: "Tanzania Internet Exchange Point (TIX)",
        type: "ixp",
        city: "Dar es Salaam",
        coordinates: { lat: -6.7924, lng: 39.2083 },
        members: 45,
        traffic: "8 Gbps",
        year: 2016,
        description: "National internet exchange"
      }
    ]
  },
  uganda: {
    name: "Uganda",
    coordinates: { lat: 1.3733, lng: 32.2903 },
    dataCenters: [
      {
        id: "ug-dc1",
        name: "Liquid Uganda Data Centre",
        type: "datacenter",
        city: "Kampala",
        coordinates: { lat: 0.3476, lng: 32.5825 },
        capacity: "Tier III",
        power: "2.5MW",
        operator: "Liquid Intelligent Technologies",
        year: 2017,
        description: "Premier carrier-neutral facility"
      },
      {
        id: "ug-dc2",
        name: "MTN Uganda Data Centre",
        type: "datacenter",
        city: "Kampala",
        coordinates: { lat: 0.3136, lng: 32.5811 },
        capacity: "Tier II",
        power: "1.5MW",
        operator: "MTN Uganda",
        year: 2015,
        description: "Mobile operator's data facility"
      },
      {
        id: "ug-dc3",
        name: "Africell DC",
        type: "datacenter",
        city: "Kampala",
        coordinates: { lat: 0.32, lng: 32.59 },
        capacity: "Tier II",
        power: "1MW",
        operator: "Africell",
        year: 2019,
        description: "Telecom operator facility"
      }
    ],
    cables: [
      {
        id: "ug-c1",
        name: "EASSy Fibre Extension",
        type: "cable",
        landingPoint: "Busia Border",
        coordinates: { lat: 0.4657, lng: 34.0892 },
        year: 2011,
        capacity: "2.4 Tbps",
        description: "Terrestrial fibre from Kenya coast"
      },
      {
        id: "ug-c2",
        name: "TEAMS Fibre",
        type: "cable",
        landingPoint: "Malaba Border",
        coordinates: { lat: 0.5789, lng: 34.2567 },
        year: 2010,
        capacity: "1.28 Tbps",
        description: "Alternative route from Kenya"
      }
    ],
    ixp: [
      {
        id: "ug-ixp1",
        name: "Uganda Internet Exchange Point (UIXP)",
        type: "ixp",
        city: "Kampala",
        coordinates: { lat: 0.3476, lng: 32.5825 },
        members: 35,
        traffic: "5 Gbps",
        year: 2014,
        description: "National peering point"
      }
    ]
  },
  rwanda: {
    name: "Rwanda",
    coordinates: { lat: -1.9403, lng: 29.8739 },
    dataCenters: [
      {
        id: "rw-dc1",
        name: "IHS Rwanda Data Centre",
        type: "datacenter",
        city: "Kigali",
        coordinates: { lat: -1.9536, lng: 30.0606 },
        capacity: "Tier III",
        power: "2MW",
        operator: "IHS Towers",
        year: 2018,
        description: "Smart city initiative facility"
      },
      {
        id: "rw-dc2",
        name: "Liquid Rwanda DC",
        type: "datacenter",
        city: "Kigali",
        coordinates: { lat: -1.9449, lng: 30.0589 },
        capacity: "Tier II",
        power: "1.5MW",
        operator: "Liquid Intelligent Technologies",
        year: 2016,
        description: "Regional business hub"
      },
      {
        id: "rw-dc3",
        name: "kLab Innovation Centre",
        type: "datacenter",
        city: "Kigali",
        coordinates: { lat: -1.95, lng: 30.07 },
        capacity: "Tier I",
        power: "500KW",
        operator: "kLab",
        year: 2012,
        description: "Tech startup incubator with hosting"
      }
    ],
    cables: [
      {
        id: "rw-c1",
        name: "Rwanda National Backbone",
        type: "cable",
        landingPoint: "Gatuna Border",
        coordinates: { lat: -1.5569, lng: 29.9689 },
        year: 2011,
        capacity: "1 Tbps",
        description: "Fibre connection to Uganda"
      },
      {
        id: "rw-c2",
        name: "Rusumo Falls Fibre",
        type: "cable",
        landingPoint: "Rusumo Border",
        coordinates: { lat: -2.2167, lng: 30.6167 },
        year: 2015,
        capacity: "640 Gbps",
        description: "Connection to Tanzania"
      }
    ],
    ixp: [
      {
        id: "rw-ixp1",
        name: "Rwanda Internet Exchange Point (RIXP)",
        type: "ixp",
        city: "Kigali",
        coordinates: { lat: -1.9536, lng: 30.0606 },
        members: 28,
        traffic: "3 Gbps",
        year: 2017,
        description: "Growing national exchange"
      }
    ]
  },
  ethiopia: {
    name: "Ethiopia",
    coordinates: { lat: 9.145, lng: 40.4897 },
    dataCenters: [
      {
        id: "et-dc1",
        name: "Ethio Telecom Data Centre",
        type: "datacenter",
        city: "Addis Ababa",
        coordinates: { lat: 9.032, lng: 38.7469 },
        capacity: "Tier III",
        power: "4MW",
        operator: "Ethio Telecom",
        year: 2019,
        description: "National carrier's flagship facility"
      },
      {
        id: "et-dc2",
        name: "Ras Dashen Data Centre",
        type: "datacenter",
        city: "Addis Ababa",
        coordinates: { lat: 9.01, lng: 38.76 },
        capacity: "Tier II",
        power: "2MW",
        operator: "Ethio Telecom",
        year: 2016,
        description: "Government cloud services"
      },
      {
        id: "et-dc3",
        name: "Safaricom Ethiopia DC",
        type: "datacenter",
        city: "Addis Ababa",
        coordinates: { lat: 9.02, lng: 38.75 },
        capacity: "Tier II",
        power: "1.5MW",
        operator: "Safaricom Ethiopia",
        year: 2023,
        description: "New market entrant facility"
      }
    ],
    cables: [
      {
        id: "et-c1",
        name: "DARE1",
        type: "cable",
        landingPoint: "Djibouti Border",
        coordinates: { lat: 11.8251, lng: 42.5903 },
        year: 2015,
        capacity: "960 Gbps",
        description: "Connection to Djibouti landing stations"
      },
      {
        id: "et-c2",
        name: "PEACE Cable Extension",
        type: "cable",
        landingPoint: "Djibouti Border",
        coordinates: { lat: 11.8251, lng: 42.5903 },
        year: 2022,
        capacity: "16 Tbps",
        description: "High-capacity link to Asia"
      }
    ],
    ixp: [
      {
        id: "et-ixp1",
        name: "Ethiopian Internet Exchange Point (ET-IXP)",
        type: "ixp",
        city: "Addis Ababa",
        coordinates: { lat: 9.032, lng: 38.7469 },
        members: 42,
        traffic: "12 Gbps",
        year: 2018,
        description: "Rapidly growing exchange"
      }
    ]
  }
};

interface InfrastructureItem {
  id: string;
  name: string;
  type: string;
  city?: string;
  coordinates: { lat: number; lng: number };
  [key: string]: any;
}

interface MapMarkerProps {
  item: InfrastructureItem;
  isSelected: boolean;
  onClick: () => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({ item, isSelected, onClick }) => {
  const getIcon = () => {
    switch (item.type) {
      case "datacenter":
        return <Server className="w-4 h-4" />;
      case "cable":
        return <Cable className="w-4 h-4" />;
      case "ixp":
        return <Network className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getColor = () => {
    switch (item.type) {
      case "datacenter":
        return "bg-blue-500 hover:bg-blue-600";
      case "cable":
        return "bg-purple-500 hover:bg-purple-600";
      case "ixp":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: isSelected ? 1.2 : 1 }}
      whileHover={{ scale: 1.3 }}
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full text-white shadow-lg ${getColor()} ${
        isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : ""
      }`}
      style={{
        left: `${((item.coordinates.lng + 42) / 84) * 100}%`,
        top: `${((item.coordinates.lat + 12) / 24) * 100}%`
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {getIcon()}
    </motion.button>
  );
};

export default function EastAfricaInfrastructureMap() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>("kenya");
  const [selectedItem, setSelectedItem] = useState<InfrastructureItem | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const allItems = useMemo(() => {
    const items: InfrastructureItem[] = [];
    
    if (selectedCountry) {
      const countryData = infrastructureData[selectedCountry as keyof typeof infrastructureData];
      if (countryData) {
        if (filterType === "all" || filterType === "datacenter") {
          items.push(...countryData.dataCenters);
        }
        if (filterType === "all" || filterType === "cable") {
          items.push(...countryData.cables);
        }
        if (filterType === "all" || filterType === "ixp") {
          items.push(...countryData.ixp);
        }
      }
    }

    if (searchQuery) {
      return items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return items;
  }, [selectedCountry, filterType, searchQuery]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "datacenter":
        return "Data Centre";
      case "cable":
        return "Submarine/Terrestrial Cable";
      case "ixp":
        return "Internet Exchange Point";
      default:
        return type;
    }
  };

  const getItemDetails = (item: InfrastructureItem) => {
    const details: { label: string; value: string }[] = [];
    
    if (item.city) details.push({ label: "Location", value: item.city });
    if (item.operator) details.push({ label: "Operator", value: item.operator });
    if (item.capacity) details.push({ label: "Capacity", value: item.capacity });
    if (item.power) details.push({ label: "Power", value: item.power });
    if (item.year) details.push({ label: "Year Operational", value: item.year.toString() });
    if (item.traffic) details.push({ label: "Traffic", value: item.traffic });
    if (item.members) details.push({ label: "Members", value: item.members.toString() });
    if (item.landingPoint) details.push({ label: "Landing Point", value: item.landingPoint });
    
    return details;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          East Africa Digital Infrastructure Map
        </h1>
        <p className="text-gray-600">
          Interactive visualization of data centres, submarine cables, fibre networks, and internet exchange points across East Africa
        </p>
      </div>

      {/* Country Selection */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(infrastructureData).map((country) => (
          <Button
            key={country}
            variant={selectedCountry === country ? "default" : "outline"}
            onClick={() => {
              setSelectedCountry(country);
              setSelectedItem(null);
            }}
            className="capitalize"
          >
            {infrastructureData[country as keyof typeof infrastructureData].name}
          </Button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search infrastructure..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Filter Options */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
              {[
                { value: "all", label: "All Types" },
                { value: "datacenter", label: "Data Centres" },
                { value: "cable", label: "Cables" },
                { value: "ixp", label: "Internet Exchanges" }
              ].map((filter) => (
                <Button
                  key={filter.value}
                  variant={filterType === filter.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType(filter.value)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-xl overflow-hidden shadow-lg border border-gray-200" style={{ height: "600px" }}>
        {/* Simplified East Africa Map Background */}
        <svg viewBox="0 0 800 600" className="w-full h-full absolute inset-0">
          {/* Country boundaries (simplified) */}
          <path
            d="M 200 150 L 350 150 L 350 300 L 200 300 Z"
            fill="#e0f2fe"
            stroke="#0ea5e9"
            strokeWidth="2"
            className="opacity-50"
          />
          <path
            d="M 350 200 L 500 200 L 500 350 L 350 350 Z"
            fill="#dcfce7"
            stroke="#22c55e"
            strokeWidth="2"
            className="opacity-50"
          />
          <path
            d="M 150 300 L 300 300 L 300 450 L 150 450 Z"
            fill="#fef3c7"
            stroke="#eab308"
            strokeWidth="2"
            className="opacity-50"
          />
          <path
            d="M 100 350 L 200 350 L 200 450 L 100 450 Z"
            fill="#fce7f3"
            stroke="#ec4899"
            strokeWidth="2"
            className="opacity-50"
          />
          <path
            d="M 400 100 L 600 100 L 600 250 L 400 250 Z"
            fill="#ede9fe"
            stroke="#8b5cf6"
            strokeWidth="2"
            className="opacity-50"
          />
          
          {/* Cable lines */}
          {selectedCountry && infrastructureData[selectedCountry as keyof typeof infrastructureData]?.cables.map((cable, index) => (
            <motion.path
              key={cable.id}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: index * 0.2 }}
              d={`M ${((cable.coordinates.lng + 42) / 84) * 800} ${((cable.coordinates.lat + 12) / 24) * 600} Q ${((cable.coordinates.lng + 45) / 84) * 800} ${((cable.coordinates.lat + 15) / 24) * 600} ${((cable.coordinates.lng + 48) / 84) * 800} ${((cable.coordinates.lat + 18) / 24) * 600}`}
              stroke="#a855f7"
              strokeWidth="3"
              fill="none"
              strokeDasharray="5,5"
              className="opacity-70"
            />
          ))}
          
          {/* Grid lines */}
          {[...Array(10)].map((_, i) => (
            <line
              key={`v${i}`}
              x1={i * 80}
              y1="0"
              x2={i * 80}
              y2="600"
              stroke="#cbd5e1"
              strokeWidth="1"
              className="opacity-30"
            />
          ))}
          {[...Array(10)].map((_, i) => (
            <line
              key={`h${i}`}
              x1="0"
              y1={i * 60}
              x2="800"
              y2={i * 60}
              stroke="#cbd5e1"
              strokeWidth="1"
              className="opacity-30"
            />
          ))}
        </svg>

        {/* Markers */}
        {allItems.map((item) => (
          <MapMarker
            key={item.id}
            item={item}
            isSelected={selectedItem?.id === item.id}
            onClick={() => setSelectedItem(item)}
          />
        ))}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
          <h3 className="font-semibold text-sm mb-2">Legend</h3>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Data Centres</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Cables</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Internet Exchanges</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        {selectedCountry && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
            <h3 className="font-semibold text-sm mb-2">
              {infrastructureData[selectedCountry as keyof typeof infrastructureData].name} Stats
            </h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between gap-4">
                <span>Data Centres:</span>
                <span className="font-medium">
                  {infrastructureData[selectedCountry as keyof typeof infrastructureData].dataCenters.length}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Cables:</span>
                <span className="font-medium">
                  {infrastructureData[selectedCountry as keyof typeof infrastructureData].cables.length}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>IXPs:</span>
                <span className="font-medium">
                  {infrastructureData[selectedCountry as keyof typeof infrastructureData].ixp.length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected Item Details Panel */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{selectedItem.name}</h2>
                  <p className="text-blue-100 text-sm mt-1">
                    {getTypeLabel(selectedItem.type)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-white/80 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <p className="text-gray-700 mb-4">{selectedItem.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getItemDetails(selectedItem).map((detail, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-500 text-sm">{detail.label}</p>
                    <p className="font-semibold text-gray-900">{detail.value}</p>
                  </div>
                ))}
              </div>

              {selectedItem.coordinates && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>
                      Coordinates: {selectedItem.coordinates.lat.toFixed(4)}, {selectedItem.coordinates.lng.toFixed(4)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Statistics */}
      {!selectedItem && selectedCountry && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <Server className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Data Centres</h3>
            </div>
            <p className="text-2xl font-bold text-blue-700">
              {infrastructureData[selectedCountry as keyof typeof infrastructureData].dataCenters.length}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Total capacity: {infrastructureData[selectedCountry as keyof typeof infrastructureData].dataCenters.reduce((sum, dc) => sum + parseFloat(dc.power), 0).toFixed(1)} MW
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <Cable className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Cable Systems</h3>
            </div>
            <p className="text-2xl font-bold text-purple-700">
              {infrastructureData[selectedCountry as keyof typeof infrastructureData].cables.length}
            </p>
            <p className="text-sm text-purple-600 mt-1">
              Combined capacity: Multiple Tbps
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <Network className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Internet Exchange</h3>
            </div>
            <p className="text-2xl font-bold text-green-700">
              {infrastructureData[selectedCountry as keyof typeof infrastructureData].ixp.length}
            </p>
            <p className="text-sm text-green-600 mt-1">
              {infrastructureData[selectedCountry as keyof typeof infrastructureData].ixp[0]?.members || 0} members, {infrastructureData[selectedCountry as keyof typeof infrastructureData].ixp[0]?.traffic || "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
