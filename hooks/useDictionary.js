import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function useDictionary(limit) {
    const { data, error, isLoading } = useSWR(process.env.EXPO_PUBLIC_API_URL + limit, fetcher);

    return {
        dictionary: data,
        isLoading,
        isError: error
    }
}