#! /usr/bin/perl -w

# create the output file
open(WRITE, ">$ARGV[0]")
|| die("\nError: write file cannot be opened.");

# open the macro directory
opendir(MACRODIR, "macros")
|| die("\nError: macro folder not found or cannot be opened.");
my @macros = readdir(MACRODIR);
closedir(MACRODIR);

# write every javascript macro
foreach my $macro (@macros)
{
    if($macro =~ /.js$/)
	{
		print("Writing macro $macro ...\n");
		open(READMACRO, "macros/$macro")
		|| die("\nError: $macro not found or cannot be opened.");
		$macro =~ s/.js$//;
		print WRITE ":: $macro [script]\n";
		while(my $line = <READMACRO>) { print WRITE $line; }
		print WRITE "\n\n";
		close(READMACRO);
	}
}

print("Complete.\n");
exit(0);