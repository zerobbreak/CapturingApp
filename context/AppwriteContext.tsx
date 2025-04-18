"use client";

import type React from "react";
import { createContext, useContext } from "react";
import { Client, Account, Databases, Storage } from "react-native-appwrite";
import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECTID,
  DATABASE_ID,
  STORAGE_BUCKET_ID,
  APPWRITE_COLLECTIONS
} from "@/appwrite-config";

const client = new Client();
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECTID)
  .setPlatform("com.company.CapturingApp");

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

//Create context
type AppwriteContextType = {
  client: Client;
  account: Account;
  databases: Databases;
  storage: Storage;
  databaseId: string;
  storageBucketId: string;
  collections: {
    workers: string
    customers: string
    checkins: string
    surveys: string
    surveyResponses: string
    reports: string
  }
};

const AppwriteContext = createContext<AppwriteContextType>({
  client,
  account,
  databases,
  storage,
  databaseId: DATABASE_ID,
  storageBucketId: STORAGE_BUCKET_ID,
  collections: {
    workers: APPWRITE_COLLECTIONS.WORKERS, 
    checkins: APPWRITE_COLLECTIONS.CHECKINS, 
    customers: APPWRITE_COLLECTIONS.CUSTOMERS,
    surveys: APPWRITE_COLLECTIONS.SURVEYS,
    surveyResponses: APPWRITE_COLLECTIONS.SURVEY_RESPONSES,
    reports: APPWRITE_COLLECTIONS.REPORTS
  }
});

export const useAppwrite = () => useContext(AppwriteContext);

export const AppwriteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const value = {
    client,
    account,
    databases,
    storage,
    databaseId: DATABASE_ID,
    storageBucketId: STORAGE_BUCKET_ID,
    collections: {
      workers: APPWRITE_COLLECTIONS.WORKERS, 
      checkins: APPWRITE_COLLECTIONS.CHECKINS, 
      customers: APPWRITE_COLLECTIONS.CUSTOMERS,
      surveys: APPWRITE_COLLECTIONS.SURVEYS,
      surveyResponses: APPWRITE_COLLECTIONS.SURVEY_RESPONSES,
      reports: APPWRITE_COLLECTIONS.REPORTS
    }
  };

  return (
    <AppwriteContext.Provider value={value}>
      {children}
    </AppwriteContext.Provider>
  );
};
