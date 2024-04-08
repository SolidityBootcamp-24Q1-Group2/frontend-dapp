"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount, useBalance, useContractRead, useContractWrite, useNetwork, useSignMessage } from "wagmi";
import deployedContracts from "../contracts/deployedContracts";
import { AddressInput, IntegerInput } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/pages/index.tsx
            </code>
          </p>
          <PageBody></PageBody>
        </div>
      </div>
    </>
  );
};

function PageBody() {
  return (
    <>
      <p className="text-center text-lg">Here we are!</p>
      <WalletInfo></WalletInfo>
    </>
  );
}

function WalletInfo() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  if (address)
    return (
      <div>
        <p>Your account address is {address}</p>
        <p>Connected to the network {chain?.name}</p>
        <Delegate></Delegate>
        <CastVote></CastVote>
        <MintTokens></MintTokens>
        <WalletAction></WalletAction>
        <WalletBalance address={address as `0x${string}`}></WalletBalance>
        <TokenInfo address={address as `0x${string}`}></TokenInfo>
      </div>
    );
  if (isConnecting)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  if (isDisconnected)
    return (
      <div>
        <p>Wallet disconnected. Connect wallet to continue</p>
      </div>
    );
  return (
    <div>
      <p>Connect wallet to continue</p>
    </div>
  );
}

function WalletAction() {
  const [signatureMessage, setSignatureMessage] = useState("");
  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage();
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing signatures</h2>
        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">Enter the message to be signed:</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={signatureMessage}
            onChange={e => setSignatureMessage(e.target.value)}
          />
        </div>
        <button
          className="btn btn-active btn-neutral"
          disabled={isLoading}
          onClick={() =>
            signMessage({
              message: signatureMessage,
            })
          }
        >
          Sign message
        </button>
        {isSuccess && <div>Signature: {data}</div>}
        {isError && <div>Error signing message</div>}
      </div>
    </div>
  );
}

function Delegate() {
  const [delegateAddress, setDelegateAddress] = useState("");

  const { data, isError, isLoading, isSuccess, write } = useContractWrite({
    address: deployedContracts[11155111].MyToken.address,
    abi: deployedContracts[11155111].MyToken.abi,
    functionName: "delegate",
    chainId: 11155111,
  });
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Delegate votes</h2>
        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">Enter the wallet address you want to delegate your votest to:</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={delegateAddress}
            onChange={e => setDelegateAddress(e.target.value)}
          />
        </div>
        <button
          className="btn btn-active btn-neutral"
          disabled={isLoading}
          onClick={() =>
            write({
              args: [delegateAddress],
            })
          }
        >
          Delegate
        </button>
        {isSuccess && <div>Transaction hash: {data?.hash}</div>}
        {isError && <div>Error delegating your vote</div>}
      </div>
    </div>
  );
}

function WalletBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: params.address,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing useBalance wagmi hook</h2>
        Balance: {data?.formatted} {data?.symbol}
      </div>
    </div>
  );
}

function TokenInfo(params: { address: `0x${string}` }) {
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing useContractRead wagmi hook</h2>
        <TokenName></TokenName>
        <TokenBalance address={params.address}></TokenBalance>
      </div>
    </div>
  );
}

function TokenName() {
  const { data, isError, isLoading } = useContractRead({
    address: "0x37dBD10E7994AAcF6132cac7d33bcA899bd2C660",
    abi: [
      {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
          {
            name: "",
            type: "string",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "name",
  });

  const name = typeof data === "string" ? data : 0;

  if (isLoading) return <div>Fetching name…</div>;
  if (isError) return <div>Error fetching name</div>;
  return <div>Token name: {name}</div>;
}

function TokenBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useContractRead({
    address: "0x37dBD10E7994AAcF6132cac7d33bcA899bd2C660",
    abi: [
      {
        constant: true,
        inputs: [
          {
            name: "_owner",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            name: "balance",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "balanceOf",
    args: [params.address],
  });

  const balance = typeof data === "number" ? data : 0;

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return <div>Balance: {balance}</div>;
}


function CastVote() {
  const [proposalIndex, setProposalIndex] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const { data, isLoading, isError, isSuccess, write  } = useContractWrite({
    address: deployedContracts[11155111].TokenizedBallot.address,
    abi: deployedContracts[11155111].TokenizedBallot.abi,
    functionName: 'vote',
    args: [proposalIndex as any, amount as any],
  })

  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Votes</h2>
        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">Proposal Index:</span>
          </label>
          <input
            type="text"
            placeholder="Proposal Index"
            className="input input-bordered w-full max-w-xs"
            value={proposalIndex}
            onChange={e => setProposalIndex(e.target.value)}
          />
          <label className="label">
            <span className="label-text">Amount:</span>
          </label>

          <input
            type="text"
            placeholder="Amount of tokens to vote with"
            className="input input-bordered w-full max-w-xs"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>
        <button
          className="btn btn-active btn-neutral"
          disabled={isLoading}
          onClick={() =>
            write({
              args: [proposalIndex as any, amount as any],
            })
          }
        >
          Cast Vote
        </button>
        {isSuccess && <div>Transaction hash: {data?.hash}</div>}
        {isError && <div>Error casting your vote</div>}
      </div>
    </div>
  )
}

function MintTokens () {
  const [isLoading, setIsLoading] = useState<boolean>(false)  
  const [toAddress, setAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const mint = async () => {
    setIsLoading(true);
    setStatus('Mining tokens')
    try {
      const payload = { address: toAddress, amount }
      console.log(payload)
      const response = await fetch('http://localhost:3001/token/mint', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      console.log(response)
      const data = await response.json()
      console.log(data.statusCode)
      if (data.statusCode === 201) {
        setStatus('Tokens minted successfully')
      } else {
        setStatus('Error minting tokens')
      }
    } catch (error) {
      setStatus('Error minting tokens')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
    <div className="card-body">
      <h2 className="card-title">Mint</h2>
      <div className="form-control w-full max-w-xs my-4">
        <label className="label">
          <span className="label-text">Address to mint tokens</span>
        </label>
        <AddressInput
          placeholder="Address to mint tokens to"
          value={toAddress}
          onChange={setAddress}
          disabled={isLoading}
        />
        <label className="label">
          <span className="label-text">Amount to mint:</span>
        </label>

        <IntegerInput
          name="Amount to mint"
          placeholder="Amount of tokens to mint"
          value={amount}
          onChange={value => setAmount(value.toString())}
          disabled={isLoading}
          disableMultiplyBy1e18
        />
      </div>
      <button
        className="btn btn-active btn-neutral"
        disabled={isLoading}
        onClick={mint}
      >
        Mint
      </button>
      {status && <div> {status}</div>}
    </div>
  </div>
  )
}
export default Home;
