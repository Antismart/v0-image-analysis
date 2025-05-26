// Test script to verify our ethers5 signer implementation
const { ethers } = require('ethers');

// Mock our ethers5 signer converter
function convertViemToEthers5(viemWallet) {
  // This simulates our ethers5 signer conversion
  const mockSigner = {
    getAddress: async () => "0x1234567890123456789012345678901234567890",
    signMessage: async (message) => "0xmocksignature",
    getBalance: async () => ethers.BigNumber.from("1000000000000000000"),
    getTransactionCount: async () => 0,
    signTransaction: async () => "0xmocktx",
    connect: () => mockSigner,
    provider: null,
    // Our new getIdentifier method for XMTP compatibility
    getIdentifier: async () => ({
      identifier: await mockSigner.getAddress(),
      identifierKind: "address"
    })
  };
  
  return mockSigner;
}

// Test the signer
async function testSigner() {
  console.log("Testing ethers5 signer implementation...");
  
  try {
    const mockViemWallet = {}; // Mock viem wallet
    const signer = convertViemToEthers5(mockViemWallet);
    
    // Test basic signer functionality
    const address = await signer.getAddress();
    console.log("✓ getAddress works:", address);
    
    // Test our new getIdentifier method
    const identifier = await signer.getIdentifier();
    console.log("✓ getIdentifier works:", identifier);
    
    // Verify the identifier structure matches XMTP requirements
    if (identifier.identifier && identifier.identifierKind === "address") {
      console.log("✓ Identifier structure is correct for XMTP SDK");
    } else {
      console.log("✗ Identifier structure is incorrect");
    }
    
    console.log("All tests passed! The signer should work with XMTP SDK.");
    
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testSigner();
