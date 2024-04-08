import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import * as deployMyToken from "./00_deploy_my_token";
import { createPublicClient, http } from "viem"
import { sepolia } from 'viem/chains'
import { toHex } from "viem";

const getCurrentBlockNumber = () => {
  const client = createPublicClient({
    chain: sepolia,
    transport: http(process.env.RPC_ENDPOINT_URL)
  })
  const blockNumber = client.getBlockNumber()
  return blockNumber
}
const deployTokenizedBallot: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const proposals = ['0', '1', '2'].map((prop) => toHex(prop, { size: 32 }))
  const myTokenContractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
  const targetBlockNumber = await getCurrentBlockNumber()

  const args = [
    proposals,
    myTokenContractAddress,
    targetBlockNumber
  ]

  console.log('**********', args)
  console.log('**********', (deployMyToken as any).target)
  await deploy("TokenizedBallot", {
    from: deployer,
    log: true,
    autoMine: true,
    args: [proposals, myTokenContractAddress, targetBlockNumber]
  });
};

export default deployTokenizedBallot;

deployTokenizedBallot.tags = ["TokenizedBallot"];
