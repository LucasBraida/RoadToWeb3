import { useState } from 'react'
import { NFTCard } from './components/nftCard'
import { Pagination } from '@mui/material';
const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTS, setNFTS] = useState([])
  const [fetchForCollection, setFetchForCollection] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [nextToken, setNextToken] = useState(0)
  const [maxSupply, setMaxSupply] = useState(0)

  const fetchNFTs = async () => {
    let nfts;
    console.log("fetching nfts");
    const api_key = "DDJ3m7_ilmAl6AOd15zVeOMjY9CLpuza"
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`;
    var requestOptions = {
      method: 'GET'
    };

    if (!collection.length) {

      const fetchURL = `${baseURL}?owner=${wallet}`;

      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    } else {
      console.log("fetching nfts for collection owned by address")
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    }

    if (nfts) {
      console.log("nfts:", nfts)
      setNFTS(nfts.ownedNfts)
    }
  }

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: 'GET'
      };
      const api_key = "DDJ3m7_ilmAl6AOd15zVeOMjY9CLpuza"
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
      if (nfts) {
        console.log("NFTs in collection:", nfts)
        setNFTS(nfts.nfts)
      }
    }
  }

  const fetchNFTsForCollectionWithStart = async (start) => {
    if (collection.length) {
      var requestOptions = {
        method: 'GET'
      };
      const api_key = "DDJ3m7_ilmAl6AOd15zVeOMjY9CLpuza"
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}&startToken=${start}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
      if (nfts) {
        console.log("NFTs in collection:", nfts)
        setNFTS(nfts.nfts)
        setNextToken(nfts.nextToken)
      }
    }
  }
  const fetchNFTsMaxSupply = async () => {
    if (collection.length) {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      const api_key = "DDJ3m7_ilmAl6AOd15zVeOMjY9CLpuza"
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getContractMetadata`;
      const fetchURL = `${baseURL}?contractAddress=${collection}`;
      const maxSupply = await fetch(fetchURL, requestOptions).then(data => data.json())
      if (maxSupply) {
        console.log(maxSupply.contractMetadata)
        setMaxSupply(maxSupply.contractMetadata.totalSupply)
      }

    }

  }

  const paginate = (page) => {
    fetchNFTsForCollectionWithStart((page - 1) * 100)
    setCurrentPage(page)
  }
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" disabled={fetchForCollection} onChange={(e) => { setWalletAddress(e.target.value) }} value={wallet} type={"text"} placeholder="Add your wallet address"></input>
        <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e) => { setCollectionAddress(e.target.value) }} value={collection} type={"text"} placeholder="Add the collection address"></input>
        <label className="text-gray-600 "><input type={"checkbox"} checked={fetchForCollection} onChange={(e) => { setFetchForCollection(e.target.checked) }} className="mr-2"></input>Fetch for collection</label>
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"}
          onClick={() => {
            if (fetchForCollection) {
              fetchNFTsMaxSupply()
              fetchNFTsForCollection()
            } else {
              fetchNFTs()
              setMaxSupply(0)
            }
          }}>Let's go! </button>
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"}
          onClick={() => {
            fetchNFTsForCollectionWithStart(99)
          }}>Next Page</button>
        {NFTS.length > 0 &&
        <div className='flex flex-col mt-4 gap-y-5 items-center w-5/6'>
          {maxSupply > 0 && <Pagination page={currentPage} count={maxSupply > 0 ? Math.ceil(maxSupply/100) : 1}
          onChange={(_, page) => {
            paginate(page)
          }}
          />}
          <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>

            {NFTS.map(nft => {
                return (
                  <NFTCard key={`${nft.title}-${nft.id.tokenId}`}nft={nft}></NFTCard>
                )
              })}

            {
              // NFTS.length > 0 && NFTS.map(nft => {
              //   return (
              //     <NFTCard key={nft.id.tokenId}nft={nft}></NFTCard>
              //   )
              // })
            }
          </div>
          {maxSupply > 0 && <Pagination page={currentPage} count={maxSupply > 0 ? Math.ceil(maxSupply/100) : 1}
          onChange={(_, page) => {
            paginate(page)
          }}
          />}
        </div>
          }

      </div>
    </div>
  )
}

export default Home
