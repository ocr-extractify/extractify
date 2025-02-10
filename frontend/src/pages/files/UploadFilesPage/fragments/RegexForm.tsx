import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import dataExtractionRegex from '@/utils/constants/dataExtractionRegex';

const RegexForm = (props: Props) => {
  const form = useForm();
  return (
    <Form {...form}>
        <div className="flex justify-between">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="shadcn" {...field} />
                        </FormControl>
                        {/* <FormDescription>This is your public display name.</FormDescription> */}
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="regex"
                render={({ field }) => (
                    <FormItem className="space-y-1">
                        <FormLabel>Regex</FormLabel>
                        <Select defaultValue={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Regex" />
                            </SelectTrigger>
                            <SelectContent>
                                {dataExtractionRegex.map((regexItem) => (
                                    <SelectItem key={regexItem.name} value={regexItem.name}>
                                        {regexItem.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>
                )}
            />
        </div>
    </Form>
  )
}

export default RegexForm