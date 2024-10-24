import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import EncodingForm from "@/components/forms/encoding-form"
import DecodingForm from "@/components/forms/decoding-form"
import Link from "next/link"

export default function Page() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Base64 Encode</CardTitle>
          <CardDescription>Convert a string to base64</CardDescription>
        </CardHeader>
        <CardContent>
          <EncodingForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Base64 Decode</CardTitle>
          <CardDescription>Convert a base64 string to text</CardDescription>
        </CardHeader>
        <CardContent>
            <DecodingForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>About Base64</CardTitle>
          <CardDescription>Learn more about base64 encoding</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It
              is commonly used for transmitting data that needs to be stored and transferred in an ASCII-based
              environment, such as email or web applications.
            </p>
            <p>
              Base64 encoding converts binary data to printable ASCII characters, making it suitable for inclusion
              in URLs, file names, and other contexts where non-ASCII characters are not allowed or may cause
              issues.
            </p>
            <Link className="text-primary" href="#">
              Learn more
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
