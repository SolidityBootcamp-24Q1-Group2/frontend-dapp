"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount, useBalance, useContractRead, useContractWrite, useNetwork, useSignMessage } from "wagmi";
import myTokenContract from '../../hardhat/artifacts/contracts/MyToken.sol/MyToken.json'
import deployedContracts from "../contracts/deployedContracts";
import { IntegerInput } from "~~/components/scaffold-eth";

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
      <RandomWord></RandomWord>
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

function RandomWord() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://randomuser.me/api/")
      .then(res => res.json())
      .then(data => {
        setData(data.results[0]);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing useState and useEffect from React library</h2>
        <h1>
          Name: {data.name.title} {data.name.first} {data.name.last}
        </h1>
        <p>Email: {data.email}</p>
      </div>
    </div>
  );
}


function CastVote() {
  const [proposalIndex, setProposalIndex] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const { data, isLoading, error, isError, isSuccess, write  } = useContractWrite({
    address: deployedContracts[11155111].TokenizedBallot.address,
    abi: deployedContracts[11155111].TokenizedBallot.abi,
    functionName: 'vote',
    args: [proposalIndex as any, amount as any],
  })

  let statusMessage = "";
  if (isLoading) statusMessage = "Loading";
  else if (isError) statusMessage = `${error?.message}`;
  else if (isSuccess) statusMessage = `${JSON.stringify(data)}`;

  return (
    <div className="flex flex-col gap-2 items-stretch">
      <span className="text-sm font-semibold">Proposal index</span>
        {}
      <IntegerInput
        name="proposalIndexInput"
        placeholder="Proposal Index"
        value={proposalIndex}
        onChange={newVal => setProposalIndex(newVal.toString())}
        disabled={isLoading} 
        disableMultiplyBy1e18 
      />
      <span className="text-sm font-semibold">Tokens Vote</span>
     {}
     <IntegerInput
        name="voteAmountInput"
        placeholder="Vote"
        value={amount}
        onChange={newVal => setAmount(newVal.toString())}  // Update state when input changes
        disabled={isLoading}  // Disable input while transaction is in process
        disableMultiplyBy1e18  // Disable automatic multiplication by 10^18
      />
        {}
      <button
        disabled={isLoading} 
        onClick={() => write()}
        className="btn self-center"
      >
        Vote
      </button>
      <span className="text-wrap">{statusMessage}</span>
    </div>

  )
}
export default Home;
