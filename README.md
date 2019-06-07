# vcf2xls

Your VCF converted to XLS from now. VCF stands for Variant Call Format and it is used by bioinformatics projects to encode structural genetic variants. 
(vcf2xls) is a free, open source and file converter software designed for big files in VCF format.

## Requirements

* Web Server (eg: Apache, Nginx, IIS)

## Docker

It is possible to containerise:
docker build -t vcf2xls .
docker run -dit --name vcf2xls -p 8080:80 vcf2xls

## Contributing

Fork the repository, make the code changes then submit a pull request.

## License

vcf2xls is released under the [GPLv3 license](LICENSE.txt).