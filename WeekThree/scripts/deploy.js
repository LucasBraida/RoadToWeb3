const main = async () => {
    try {
        const [owner, randomPerson, randomPerson2] = await hre.ethers.getSigners();

      const nftContractFactory = await hre.ethers.getContractFactory(
        "ChainBattles"
      );
      const nftContract = await nftContractFactory.deploy();
      await nftContract.deployed();

      console.log("Contract deployed to:", nftContract.address);

      let tx = await nftContract.connect(randomPerson).mint();
      tx.wait();
      tx = await nftContract.connect(randomPerson).mint();
      tx.wait();
      tx = await nftContract.connect(randomPerson2).mint();
      tx.wait();
      tx = await nftContract.connect(randomPerson2).mint();
      tx.wait();

      let stats = await nftContract.getCharacterStats(0)

      console.log('Random Person 1 token 0 ', stats)
      stats = await nftContract.getCharacterStats(1)

      console.log('Random Person 1 token 1 ', stats)
      stats = await nftContract.getCharacterStats(2)

      console.log('Random Person 1 token 2 ', stats)
      stats = await nftContract.getCharacterStats(3)

      console.log('Random Person 1 token 3 ', stats)
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };

  main();
